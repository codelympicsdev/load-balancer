const fs = require('fs');
const fetch = require('isomorphic-unfetch');

fetch('https://yh6f0r4529hb.statuspage.io/api/v2/summary.json')
  .then(resp => resp.json())
  .then(data => {
    Promise.all(
      data.components
        .filter(c => c.name.includes('- ('))
        .map(n => {
          let c1 = n.name.split(', ');

          return {
            code: n.name.split('(')[1].replace(')', ''),
            country: c1[c1.length - 1].split(' - (')[0],
          };
        })
        .map(async c => {
          const resp = await fetch(
            `https://restcountries.eu/rest/v2/name/${c.country}`
          );
          if (resp.ok) {
            const country = await resp.json();
            c.region = country[0].region;
            c.subregion = country[0].subregion;
          }
          return c;
        })
    ).then(dc => fs.writeFileSync('datacenters.json', JSON.stringify(dc)));
  });

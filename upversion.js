const fs = require('fs');

module.exports = (ctx) => {

  if (!ctx) {
    return;
  }

  //console.log("%cBuild", "color: white; background-color: #007acc;", ctx);
  if (ctx.build.configuration === "production" && ctx.env.OS === "Windows_NT") {
    console.log(".:: Update Version ::...");

    // update package.json:
    let packageJSON = JSON.parse(fs.readFileSync('package.json', 'utf-8').toString());
    let versionArray = packageJSON.version.split(".");
    versionArray[2] = (parseInt(versionArray[2]) + 1).toString();
    packageJSON.version = versionArray.join(".");
    fs.writeFileSync('package.json', JSON.stringify(packageJSON, null, "\t"), 'utf-8');
    console.log("%cNew Version", "color: white; background-color: #007acc;", packageJSON.version);
    console.log("%cUpdate AppVersion in package.json", "color: #007acc;");

    packageJSON = JSON.parse(fs.readFileSync('projects/ion-calendar/package.json', 'utf-8').toString());
    packageJSON.version = versionArray.join(".");
    fs.writeFileSync('package.json', JSON.stringify(packageJSON, null, "\t"), 'utf-8');
    console.log("%cNew Version", "color: white; background-color: #007acc;", packageJSON.version);
    console.log("%cUpdate AppVersion in ion-calendar/package.json", "color: #007acc;");

    console.log("%c ", "font-size: 1px; padding: 125px 125px; background-size: 250px 250px; background: no-repeat url(https://i2.wp.com/i.giphy.com/media/12BYUePgtn7sis/giphy-downsized.gif?w=770&amp;ssl=1);")
  };

};

require("dotenv").config();
import fs from "fs";
import { Command } from "commander";

import { summon, Summoner } from "../lib/rarityInteractions";

export const program: any = new Command();

interface CLIParameters {
  number: number;
  class: number | string;
}

program
  .version("0.1.0")
  .option(
    "-n, --number <n>",
    "Number of summonings",
    (value: string) => Number(value),
    1
  )
  .option(
    "-c, --class <class>",
    "The class of summonings, either an index or the name",
    (value: string) => {
      let classIndex = Number(value);
      if (!classIndex) return value;
      return classIndex;
    },
    1
  )
  .action(async (options: CLIParameters, command: any) => {
    let summoners: Summoner[] = [];
    try {
        summoners = JSON.parse(fs.readFileSync("./summoners.json").toString());
    } catch (err) {
        console.log("No existing summoners found")
    }

    for (let i = 0; i < options.number; i++) {
      const summoner: Summoner = await summon(options.class);
      summoners.push(summoner);
    }

    fs.writeFileSync("./summoners.json", JSON.stringify(summoners, null, 2));
  })
  .parse(process.argv);

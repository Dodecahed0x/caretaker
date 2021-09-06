require("dotenv").config();
import fs from "fs";
import { Command } from "commander";

import { classes, train, Summoner } from "../lib/rarityInteractions";

export const program: any = new Command();

interface CLIParameters {
  number: number;
  class: number | string;
}

program
  .version("0.1.0")
  .action(async () => {
    let summoners: Summoner[] = [];
    try {
      summoners = JSON.parse(fs.readFileSync("./summoners.json").toString());
    } catch (err) {
      throw new Error("There are no adventurers");
    }

    for (const summoner of summoners) {
      const status = await train(summoner.id);
      if (status)
        console.log(
          `Trained summoner ${classes[summoner.class-1]} ${summoner.id}`
        );
      else
        console.log(
          `Summoner ${classes[summoner.class-1]} ${
            summoner.id
          } was already trained`
        );
    }
  })
  .parse(process.argv);

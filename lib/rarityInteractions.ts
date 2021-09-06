import { Contract, Event } from "ethers";
import { wallet } from "./wallet";
import abi from "../abi/rarity.json";
import config from "../config.json";

export const classes = [
  "Barbarian",
  "Bard",
  "Cleric",
  "Druid",
  "Fighter",
  "Monk",
  "Paladin",
  "Ranger",
  "Rogue",
  "Sorcerer",
  "Wizard",
];

export interface Summoner {
  id: number;
  class: number;
}

const getInstance = () => {
  return new Contract(config.rarityAddress, abi, wallet);
};

/**
 * @dev Create a new summoner
 * @param {number | string} classOrIndex: Index of the class or name of the class
 * @return The id of the created summoner
 */
export const summon = async (classOrIndex: number | string) => {
  const classIndex =
    typeof classOrIndex === "string"
      ? classes.indexOf(classOrIndex)
      : classOrIndex;

  if (classIndex < 1 || classIndex > classes.length)
    throw new Error("Invalid class index");

  const instance = getInstance();
  const tx = await instance.summon(classIndex);
  const res = await tx.wait();
  const summoning = res.events.filter((e: Event) => e.event === "summoned")[0];
  return {
    id: summoning.args.summoner.toNumber() as number,
    class: summoning.args.class.toNumber() as number,
  };
};

/**
 * @dev Train a summoner
 * @param {number} id: Id of the summoner to train
 * @return {boolean} True if allowed to go on an adventure
 */
export const train = async (id: number): Promise<boolean> => {
  const instance = getInstance();
  const adventurersLog = (await instance.adventurers_log(id)).toNumber() * 1000;

  if (Date.now().valueOf() < adventurersLog) return false;

  const tx = await instance.adventure(id);
  await tx.wait()
  return true;
};

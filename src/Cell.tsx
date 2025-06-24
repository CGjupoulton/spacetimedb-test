import React from "react";
import { Food, Steve, User } from "./module_bindings";
import { animals } from "./grid";



const nicoUrl = new URL("./img/nico.gif", import.meta.url).href;
const kaiUrl = new URL("./img/kai.gif", import.meta.url).href;
const eloiUrl = new URL("./img/eloi.gif", import.meta.url).href;

type Props = {
  steve?: Steve
  username?: string
  food?: Food
  x: number
  y: number
};

function Cell({ username, steve, food, x, y }: Props) {
  let isPostGame = steve?.level > animals.length
  let overcharge = steve?.level - animals.length

  if (steve) {
    const png = getPng(username);
    return (
      <>
        <div
          className={`${isPostGame ? 'post-game' : ''}`}
        >
          <div
            style={isPostGame ? {
              transform: `scale(${1+overcharge/ 20}, ${1+overcharge / 20})`,
            } : {}}
          >
            {isPostGame && isNico(username) ? (
                <img src={nicoUrl} style={{maxWidth: 20, maxHeight: 20}} />
            ) : isPostGame && isKai(username) ? (
                <img src={kaiUrl} style={{maxWidth: 20, maxHeight: 20}} />
            ) : isPostGame && isEloi(username) ? (
                <img src={eloiUrl} style={{maxWidth: 20, maxHeight: 20}} />
            ) : isPostGame && png != null ? (
                <img src={png} style={{maxWidth: 20, maxHeight: 20}} />
            ) : (
              animals[Math.min(animals.length, steve.level) - 1]
            )}
          </div>
        </div>
        <div
          className={`${isPostGame ? 'post-game-text' : ''}`}
        >
          {username}
        </div>
      </>
    )
  } else if (food) {
    return (
      <>
        🍔
      </>
    )
  }

  return (
     <></>
  )
}

export default React.memo(Cell)

function isNico(username?: string): boolean {
  return username?.toLowerCase().includes('nico')
  || username?.toLowerCase() == 'nai'
}


function isKai(username?: string): boolean {
  return username?.toLowerCase().includes('kai')
  || username?.toLowerCase() == 'ksa'
}


function isEloi(username?: string): boolean {
  return username?.toLowerCase().includes('eloi')
  || username?.toLowerCase() == 'edr'
}

const PNGS = {
  boris: new URL("./img/boris.png", import.meta.url).href,
  gaspar: new URL("./img/gaspar.png", import.meta.url).href,
  jd: new URL("./img/jd.png", import.meta.url).href,
  loick: new URL("./img/loick.png", import.meta.url).href,
  max: new URL("./img/max.png", import.meta.url).href,
  nono: new URL("./img/nono.png", import.meta.url).href,
  pierre: new URL("./img/pierre.png", import.meta.url).href,
  wilfried: new URL("./img/wilfried.png", import.meta.url).href,
}

function getPng(username?:string): string| undefined {
  return PNGS[username?.toLowerCase() ?? '']
}
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { createGrid, Grid } from "./grid";
import { state, connect } from "./connection";
import { Steve, User } from "./module_bindings";
import ConnectedUsers from "./ConnectedUsers";
import Cell from "./Cell";
import { useFoods, useSteves, useUsers } from "./hooks";

const SIZE = 10;

export default function App() {
  const [grid, setGrid] = useState<Grid>(createGrid(SIZE))
  const users = useUsers(state.conn)
  const steves = useSteves(state.conn)
  const foods = useFoods(state.conn) // WARNING: "foods" is not a real English word!
  const myUser: User | undefined = users.get(state.conn?.identity?.toHexString?.())
  const mySteve = steves.get(myUser?.identity.toHexString())
  const [showNameModal, setShowNameModal] = useState(false)
  const [nameInput, setNameInput] = useState(myUser?.name ?? "")
  const [error, setError] = useState<string>('');

  const stevesByCoords = useMemo(() => {
    const map = new Map<string, Steve>();
    steves.forEach(steve => {
      const key = `${steve.x}-${steve.y}`;
      map.set(key, steve);
    });
    return map;
  }, [steves]);
  
  function handleResetName() {
    setShowNameModal(true)
  }
  
  const handleMoveSteve = useCallback((dx: number, dy: number) => {
    if (mySteve != null) {
      const newX = mySteve.x + dx;
      const newY = mySteve.y + dy;

      // Check bounds
      if (newX < 0 || newX >= SIZE || newY < 0 || newY >= SIZE) {
        console.warn("Move out of bounds");
        return;
      }

      // Call move reducer
      state.conn.reducers.moveSteveDirection(dx, dy);
    }
  }, [mySteve])

  useEffect(() => {
    
    const handleKeyDown = (event: KeyboardEvent) => {
      if (showNameModal) {
        return;
      }
      switch (event.key) {
        case 'ArrowUp':
          handleMoveSteve(0, -1)
          event.preventDefault()
          break
        case 'ArrowDown':
          handleMoveSteve(0, 1)
          event.preventDefault()
          break
        case 'ArrowLeft':
          handleMoveSteve(-1, 0)
          event.preventDefault()
          break
        case 'ArrowRight':
          handleMoveSteve(1, 0)
          event.preventDefault()
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleMoveSteve]);


  useEffect(() => {
    async function init() {
      if (!state.connected) {
        try {
          await connect();
          setGrid([...grid])
        } catch (error) {
          setError(error);
        }
      } else {
        console.log("[>]Already connected to SpacetimeDB")
      }
    }
    console.log('[>]init use effect')
    init()
  }, []);
  
  const submitName = async () => {
    if (nameInput.trim() === "") return

    await state.conn.reducers.setName(nameInput)
    setShowNameModal(false)
  };
  
  if (error) {
    return <div id="error">{error}</div>;
  }

  if (!state.connected) {
    return <div id="loading">Loading...</div>;
  }
  
  if (!myUser?.name || showNameModal) {
    return (
      <div id="name-modal" style={{ padding: 20 }}>
      <h2>Enter your name</h2>
      <form 
        onSubmit={(e) => {
          e.preventDefault(); 
          submitName();
        }}
      >
        <input
          maxLength={10}
          minLength={1}
          placeholder="ASCII only"
          type="text"
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
        />
        <button>Join</button>
      </form>
      </div>
    );
  }
  
  function handleCellClick(x: number, y: number, steveOnCell?: Steve): void {
    if (steveOnCell == null && mySteve == null) {
      // Call spawn reducer
      state.conn.reducers.spawnSteve(x, y)
    } else if (mySteve != null) {
      // Call move reducer
      state.conn.reducers.moveSteve(x, y);
    }
  }
  return (
    <>
    <ConnectedUsers users={users} />
    <div id="game-container">
      <h1>Steve MMO</h1>
      <p>Your name is: {myUser?.name} <button onClick={() => handleResetName()}>edit</button></p>
      <div
      id="grid"
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${SIZE}, 50px)`,
        gridTemplateRows: `repeat(${SIZE}, 50px)`,
      }}
      >
      {grid.map((row, y) =>
        row.map((cell, x) => { 
          const steve = stevesByCoords.get(`${x}-${y}`)
          const user = users.get(steve?.user.toHexString())
          const food = foods.get(`${x}-${y}`);
          return (
          <div
            key={`${y}-${x}`}
            className={`cell ${food ? "occupied" : ""}`}
            onClick = {() => handleCellClick(x, y, steve)}
          >
            <Cell x={x} y={y} steve={steve} username={user?.name} food={food} />
          </div>
        )})
      )}
      </div>
    </div>
  </>
  )
}

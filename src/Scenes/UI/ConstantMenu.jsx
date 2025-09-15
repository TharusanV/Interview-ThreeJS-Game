import './ConstantMenu.css'
import { useGameStore, gameStates } from '../../GlobalStateManager/useGameStore';


const ConstantMenu = () => {
  const gameState = useGameStore((state) => state.gameState);
  const startGame = useGameStore((state) => state.startGame);

  return (
    <>
      <div className={`menu ${gameState !== gameStates.MENU ? "menu--hidden" : ""}`}>
        <button 
          data-text="START" 
          disabled={gameState !== gameStates.MENU} 
          onClick={() => {startGame()}}
        >
            START
        </button>
      </div>

      <div className={`inGameMenu ${gameState !== gameStates.INGAME ? "inGameMenu--hidden" : ""}`}>

      </div>
    </>
  );
};

export default ConstantMenu;
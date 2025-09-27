import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Modal, FlatList} from 'react-native'; // Import AsyncStorage
import AsyncStorage from '@react-native-async-storage/async-storage';
// ========================================================================
//  GAME DATA & CONFIGURATION
// ========================================================================

const GRID_SIZE = 10;
const ICONS = {
  PLAYER: '🕵️',
  EMPTY: '⬛',
  CLUE: '❓',
  RESCUE: '🆘',
  DAMAGED_PIPE: '💧',
  UNSTABLE_BUILDING: '🏢',
  BLOCKED_DRAIN: '🚧',
  PUMP_STATION: '🏭',
};

const LEVELS = [
  {
    level: 1,
    name: 'The Deluge',
    initialAP: 30,
    initialResources: { ropes: 1, sandbags: 2, drones: 1 },
    briefing: 'A critical pipe has burst, and the pumping station is failing. Find the cause before the district is completely flooded!',
    gridItems: [
      { id: 'c1', type: 'CLUE', pos: { x: 2, y: 5 }, icon: ICONS.DAMAGED_PIPE, name: 'Damaged Pipe', description: 'This is the main water pipe. It has a massive structural fracture!', clueId: 'PIPE_FRACTURE' },
      { id: 'c2', type: 'CLUE', pos: { x: 7, y: 2 }, icon: ICONS.PUMP_STATION, name: 'Pumping Station', description: 'The station is offline. An engineering memo indicates foundation cracks.', clueId: 'FOUNDATION_CRACKS' },
      { id: 'r1', type: 'RESCUE', pos: { x: 5, y: 7 }, icon: ICONS.RESCUE, name: 'Trapped Civilian', description: 'A civilian is trapped by rising water!' },
    ],
    decisions: {
      title: 'How do you stop the flood?',
      options: [
        { id: 'd1', text: 'Deploy Sandbags at the Riverbank', requiredClue: null, result: { apChange: 0, message: 'The sandbags slow the water, but it\'s not enough. The district suffers moderate damage. MISSION FAILED.' } },
        { id: 'd2', text: 'Reinforce Pumping Station Foundation', requiredClue: 'FOUNDATION_CRACKS', result: { apChange: 0, message: 'You reinforce the foundation, but the main pipe is still broken! MISSION FAILED.' } },
        { id: 'd3', text: 'Divert Water & Patch Main Pipe', requiredClue: 'PIPE_FRACTURE', result: { apChange: 0, message: 'By patching the pipe, you stop the source of the flood! The city is safe. MISSION COMPLETE!' } },
      ],
      criticalCluesNeeded: 2,
    },
  },
  // TODO: Add more levels here (e.g., Earthquake, Fire)
];

type Position = { x: number; y: number };
type GamePhase = 'INVESTIGATION' | 'DECISION' | 'MINI_GAME' | 'GAME_OVER' | 'TUTORIAL';
type Resources = { ropes: number; sandbags: number; drones: number };
type GridItem = { id: string; type: 'CLUE' | 'RESCUE'; pos: Position; icon: string; name: string; description: string; clueId?: string };

// ========================================================================
//  MAIN APP COMPONENT
// ========================================================================

const TUTORIAL_SEEN_KEY = '@DisasterDetective:tutorialSeen';

export default function App() {
  // --- STATE MANAGEMENT ---
  const [levelData] = useState(LEVELS[0]);
  const [playerPos, setPlayerPos] = useState<Position>({ x: 0, y: 0 });
  const [ap, setAp] = useState(levelData.initialAP);
  const [resources, setResources] = useState<Resources>(levelData.initialResources);
  const [foundClues, setFoundClues] = useState<string[]>([]);
  const [log, setLog] = useState<string[]>([levelData.briefing]);
  const [gamePhase, setGamePhase] = useState<GamePhase>('TUTORIAL'); // Start in TUTORIAL phase
  const [activeItem, setActiveItem] = useState<GridItem | null>(null);
  const [gameOverMessage, setGameOverMessage] = useState('');
  const [showTutorial, setShowTutorial] = useState(true);

  // --- GAME INITIALIZATION & STATE CHECKS ---
  useEffect(() => {
    const checkTutorialStatus = async () => {
      try {
        const tutorialSeen = await AsyncStorage.getItem(TUTORIAL_SEEN_KEY);
        if (tutorialSeen === 'true') {
          setShowTutorial(false);
          setGamePhase('INVESTIGATION');
        } else {
          setShowTutorial(true);
          setGamePhase('TUTORIAL');
        }
      } catch (error) {
        console.error("Error loading tutorial status", error);
        setShowTutorial(true); // Default to showing tutorial on error
        setGamePhase('TUTORIAL');
      }
    };
    checkTutorialStatus();
  }, []); // Run once on component mount

  useEffect(() => {
    if (ap <= 0 && gamePhase !== 'GAME_OVER' && gamePhase !== 'TUTORIAL') {
      setGamePhase('GAME_OVER');
      setGameOverMessage('You ran out of Action Points! The disaster has worsened.');
    }
  }, [ap, gamePhase]);

  useEffect(() => {
    if (foundClues.length >= levelData.decisions.criticalCluesNeeded && gamePhase === 'INVESTIGATION') {
      addLog('You\'ve gathered enough intel! It\'s time to make a critical decision.');
      setGamePhase('DECISION');
    }
  }, [foundClues, levelData.decisions.criticalCluesNeeded, gamePhase]);

  // --- CORE GAME LOGIC ---
  const addLog = (message: string) => {
    setLog(prev => [message, ...prev.slice(0, 100)]);
  };

  const movePlayer = (dx: number, dy: number) => {
    if (gamePhase !== 'INVESTIGATION' || ap <= 0) return;

    const newX = Math.max(0, Math.min(GRID_SIZE - 1, playerPos.x + dx));
    const newY = Math.max(0, Math.min(GRID_SIZE - 1, playerPos.y + dy));

    // Optional: Prevent moving into a clue/rescue square if it's already "activated"
    const currentOccupyingItem = levelData.gridItems.find(item => item.pos.x === newX && item.pos.y === newY);
    if (currentOccupyingItem && foundClues.includes(currentOccupyingItem.clueId || '')) {
      // Allow movement, but perhaps log a different message if it's already investigated/rescued
    }

    setPlayerPos({ x: newX, y: newY });
    setAp(a => a - 1);
    addLog(`Moved to ${String.fromCharCode(65 + newY)}${newX + 1}. (-1 AP)`);
    // TODO: Add a chance for a random event to occur here
  };

  const interact = (item: GridItem) => {
    if (gamePhase !== 'INVESTIGATION') return;
    setActiveItem(item); // Show interaction modal
  };
  
  const handleInteraction = () => {
    if (!activeItem) return;

    addLog(`Interacting with ${activeItem.name}...`);
    setAp(a => a - 1); // Interaction costs 1 AP

    if (activeItem.type === 'CLUE' && activeItem.clueId && !foundClues.includes(activeItem.clueId)) {
      setFoundClues(prev => [...prev, activeItem.clueId!]);
      addLog(`CLUE FOUND: ${activeItem.description}`);
    } else if (activeItem.type === 'RESCUE') {
      // This is a placeholder for a mini-game
      if (resources.ropes > 0) {
        setResources(r => ({ ...r, ropes: r.ropes - 1 }));
        setAp(a => a + 5); // Reward for successful rescue
        addLog(`Used 1 rope. Civilian rescued! You gained 5 AP for your quick action.`);
      } else {
        addLog('You need a rope to attempt a rescue!');
      }
    }
    setActiveItem(null); // Close modal
  };

  const handleDecision = (option: typeof levelData.decisions.options[0]) => {
    setGamePhase('GAME_OVER');
    setGameOverMessage(option.result.message);
  };
  
  const restartGame = () => {
    setPlayerPos({ x: 0, y: 0 });
    setAp(levelData.initialAP);
    setResources(levelData.initialResources);
    setFoundClues([]);
    setLog([levelData.briefing]);
    setGamePhase('INVESTIGATION');
    setGameOverMessage('');
    setActiveItem(null);
  }

  const closeTutorial = async () => {
    try {
      await AsyncStorage.setItem(TUTORIAL_SEEN_KEY, 'true');
      setShowTutorial(false);
      setGamePhase('INVESTIGATION');
      addLog('Tutorial closed. Begin your mission!');
    } catch (error) {
      console.error("Error saving tutorial status", error);
      // Fallback: close tutorial but don't save status
      setShowTutorial(false);
      setGamePhase('INVESTIGATION');
    }
  };

  const openTutorial = () => {
    setShowTutorial(true);
    setGamePhase('TUTORIAL'); // Ensure game is paused during tutorial
  };

  // --- RENDER FUNCTIONS ---
  const renderGrid = () => {
    const grid = Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(null));
    return grid.map((row, y) => (
      <View key={y} style={styles.row}>
        {row.map((_, x) => {
          const item = levelData.gridItems.find(it => it.pos.x === x && it.pos.y === y);
          const isPlayerHere = playerPos.x === x && playerPos.y === y;
       const isItemResolved = item?.clueId ? foundClues.includes(item.clueId) : false;

          let content = ICONS.EMPTY;
          if (item) {
            if (item.type === 'CLUE' && isItemResolved) {
              content = ICONS.EMPTY; // Clue disappears once found
            } else if (item.type === 'RESCUE' && isItemResolved) {
              // TODO: A rescued civilian icon or empty if it's a one-time interaction
              content = ICONS.EMPTY; 
            } else {
              content = item.icon;
            }
          }
          if (isPlayerHere) content = ICONS.PLAYER;

          return (
            <TouchableOpacity key={x} style={styles.cell} onPress={() => (isPlayerHere && item && !isItemResolved) && interact(item)} disabled={gamePhase !== 'INVESTIGATION'}>
              <Text style={styles.cellText}>{content}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    ));
  };
  
  return (
    <View style={styles.container}>
      {/* --- GAME OVER MODAL --- */}
      <Modal visible={gamePhase === 'GAME_OVER'} transparent={true} animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{gameOverMessage.includes('COMPLETE') ? 'VICTORY' : 'MISSION FAILED'}</Text>
            <Text style={styles.modalText}>{gameOverMessage}</Text>
            <TouchableOpacity style={styles.modalButton} onPress={restartGame}>
              <Text style={styles.buttonText}>Restart</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* --- INTERACTION MODAL --- */}
      <Modal visible={activeItem !== null} transparent={true} animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{activeItem?.name}</Text>
            <Text style={styles.modalText}>{activeItem?.description}</Text>
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.modalButton} onPress={handleInteraction}>
                <Text style={styles.buttonText}>{activeItem?.type === 'RESCUE' ? 'Use 1 Rope' : 'Investigate (-1 AP)'}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => setActiveItem(null)}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* --- DECISION MODAL --- */}
      <Modal visible={gamePhase === 'DECISION'} transparent={true} animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{levelData.decisions.title}</Text>
            {levelData.decisions.options.map(opt => {
              const isUnlocked = !opt.requiredClue || foundClues.includes(opt.requiredClue);
              return (
                <TouchableOpacity key={opt.id} style={[styles.modalButton, !isUnlocked && styles.disabledButton]} disabled={!isUnlocked} onPress={() => handleDecision(opt)}>
                  <Text style={styles.buttonText}>{opt.text}{!isUnlocked ? ' (Requires Clue)' : ''}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </Modal>

      {/* --- TUTORIAL MODAL --- */}
      <Modal visible={showTutorial} transparent={true} animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Welcome, Detective!</Text>
            <Text style={styles.modalText}>
              Your mission: Navigate the disaster zone (grid) to find clues and rescue civilians.
              {"\n\n"}
              **Controls:** Use the D-pad (↑↓←→) to move your detective (🕵️). Each move costs 1 AP.
              {"\n\n"}
              **Interact:** Step on special squares (❓Clue, 🆘Rescue) and tap the square to interact. This costs 1 AP.
              {"\n\n"}
              **Objective:** Find all critical clues to unlock the Decision Phase and choose the best course of action to save the day!
              {"\n\n"}
              **AP (Action Points):** Your time limit! Don't let it hit zero. Rescues can grant more AP.
              {"\n\n"}
              Good luck, Detective!
            </Text>
            <TouchableOpacity style={styles.modalButton} onPress={closeTutorial}>
              <Text style={styles.buttonText}>Got It!</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* --- HEADER & HUD --- */}
      <View style={styles.topBar}>
        <Text style={styles.title}>{levelData.name}</Text>
        <TouchableOpacity style={styles.tutorialButton} onPress={openTutorial}>
          <Text style={styles.tutorialButtonText}>?</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.hud}>
        <Text style={styles.hudText}>AP: {ap}</Text>
        <Text style={styles.hudText}>Ropes: {resources.ropes} | Sandbags: {resources.sandbags}</Text>
      </View>
      
      {/* --- GAME GRID --- */}
      <View style={styles.gridContainer}>{renderGrid()}</View>

      {/* --- CONTROLS --- */}
      <View style={styles.controls}>
        <View />
        <TouchableOpacity style={styles.controlButton} onPress={() => movePlayer(0, -1)} disabled={gamePhase !== 'INVESTIGATION'}><Text style={styles.buttonText}>↑</Text></TouchableOpacity>
        <View />

        <TouchableOpacity style={styles.controlButton} onPress={() => movePlayer(-1, 0)} disabled={gamePhase !== 'INVESTIGATION'}><Text style={styles.buttonText}>←</Text></TouchableOpacity>
        <View style={styles.controlCenter} /> {/* Central empty space */}
        <TouchableOpacity style={styles.controlButton} onPress={() => movePlayer(1, 0)} disabled={gamePhase !== 'INVESTIGATION'}><Text style={styles.buttonText}>→</Text></TouchableOpacity>

        <View />
        <TouchableOpacity style={styles.controlButton} onPress={() => movePlayer(0, 1)} disabled={gamePhase !== 'INVESTIGATION'}><Text style={styles.buttonText}>↓</Text></TouchableOpacity>
        <View />
      </View>
      
      {/* --- LOG --- */}
      <View style={styles.logContainer}>
        <FlatList data={log} inverted renderItem={({ item, index }) => <Text style={[styles.logText, index === 0 && styles.logTextLatest]}>• {item}</Text>} keyExtractor={(_, i) => i.toString()} />
      </View>
    </View>
  );
}

// ========================================================================
//  STYLES
// ========================================================================

const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a1a', paddingTop: 50, paddingHorizontal: 10 },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#fff', textAlign: 'center', flex: 1 },
  tutorialButton: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#007BFF', justifyContent: 'center', alignItems: 'center' },
  tutorialButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  hud: { flexDirection: 'row', justifyContent: 'space-between', padding: 10, backgroundColor: '#333', borderRadius: 8, marginBottom: 10 },
  hudText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  gridContainer: { aspectRatio: 1, width: '100%', backgroundColor: '#000', borderRadius: 8 },
  row: { flex: 1, flexDirection: 'row' },
  cell: { flex: 1, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#444' },
  cellText: { fontSize: width / 15 },
  
  controls: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 200, // Adjusted width for D-pad
    height: 200, // Adjusted height for D-pad
    alignSelf: 'center',
    marginVertical: 15,
    justifyContent: 'center',
  },
  controlButton: {
    width: 60, height: 60,
    backgroundColor: '#555',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5, // Small margin for spacing
  },
  // Specific positioning for D-pad buttons
  // Using flexWrap with specific empty Views to achieve the layout
  controlCenter: {
    width: 60, height: 60, // Empty space in the center of the D-pad
    margin: 5,
  },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  logContainer: { flex: 1, backgroundColor: '#222', borderRadius: 8, padding: 10, maxHeight: 150 },
  logText: { color: '#ccc', fontSize: 14 },
  logTextLatest: { color: '#fff', fontWeight: 'bold' },
  
  // Modal Styles
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.8)' },
  modalContent: { backgroundColor: '#333', padding: 20, borderRadius: 10, width: '90%', alignItems: 'center', borderWidth: 1, borderColor: '#555' },
  modalTitle: { fontSize: 22, fontWeight: 'bold', color: '#fff', marginBottom: 15 },
  modalText: { fontSize: 16, color: '#ccc', textAlign: 'center', marginBottom: 20 },
  modalButton: { backgroundColor: '#007BFF', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 8, marginVertical: 5, width: '100%', alignItems: 'center' },
  cancelButton: { backgroundColor: '#6c757d' },
  disabledButton: { backgroundColor: '#555' },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
});
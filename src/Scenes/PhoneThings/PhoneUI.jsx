import { RoundedBox, Text, Box, Circle } from "@react-three/drei"
import { degToRad } from "three/src/math/MathUtils.js";

import './HomeUI.css'
import { Play, SkipBack, SkipForward, WifiOff, BatteryLow } from "lucide-react";

import { useGameStore, gameStates } from '../../GlobalStateManager/useGameStore';

import { useState } from "react";



import React from "react";


export default function PhoneUI() {

  const phoneApps = [
    { name: 'Start', colors: ['#FF8A65', '#FF5252'] },
    { name: 'Load', colors: ['#7C4DFF', '#40C4FF'] },
    { name: 'Settings', colors: ['#FFD54F', '#FF8A65'] },
    { name: 'Credits', colors: ['#4DB6AC', '#81C784'] },
    /*
    { name: 'Notes', colors: ['#A1887F', '#FFCC80'] },
    { name: 'Game', colors: ['#F06292', '#BA68C8'] },
    { name: 'Chat', colors: ['#64B5F6', '#4FC3F7'] },
    { name: 'Map', colors: ['#AED581', '#7CB342'] }
    */
  ];


  const phone = {
    fontFamily: 'Inter, Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    
    position: "fixed",
    bottom: "0", left: "55%",

    width: 360,
    height: 780,
    borderRadius: 42,
    boxShadow: '0 30px 80px rgba(2,6,23,0.7), inset 0 1px 0 rgba(255,255,255,0.03)',
    background: 'linear-gradient(180deg, #0f0c29, #302b63, #24243e)',
    padding: 14,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid rgba(255,255,255,0.06)'
  };

  const screen = {
    width: '100%',
    height: '100%',
    borderRadius: 32,
    overflow: 'hidden',
    position: 'relative',
    background: 'linear-gradient(135deg, rgba(255,111,145,0.10), rgba(168,85,255,0.08))',
    display: 'flex',
    flexDirection: 'column'
  };

  const animatedBg = {
    position: 'absolute',
    inset: 0,
    background: 'radial-gradient(600px 250px at 10% 20%, rgba(255,111,145,0.12), transparent 10%), radial-gradient(500px 200px at 90% 80%, rgba(121,182,255,0.12), transparent 10%), linear-gradient(120deg, rgba(255,200,128,0.03), rgba(200,120,255,0.02))',
    mixBlendMode: 'screen',
    animation: 'floatBG 18s ease-in-out infinite'
  };

  const statusBar = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 16px',
    color: 'rgba(255,255,255,0.92)',
    zIndex: 5,
    fontSize: 12,
    textShadow: '0 1px 0 rgba(0,0,0,0.35)'
  };

  const timeStyle = { 
    fontWeight: 700, 
    fontSize: 18 
  };

  const homeArea = {
    padding: 18,
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
    zIndex: 3
  };

  const widget = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: 'linear-gradient(90deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))',
    borderRadius: 16,
    padding: 12,
    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.02), 0 8px 20px rgba(5,8,20,0.4)'
  };

  const appsGrid = {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 12,
    marginTop: 4
  };

  const appIcon = {
    height: 74,
    borderRadius: 18,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 12,
    color: 'white',
    background: 'linear-gradient(180deg, rgba(255,255,255,0.02), rgba(0,0,0,0.08))',
    boxShadow: '0 6px 18px rgba(13,16,35,0.55), inset 0 1px 0 rgba(255,255,255,0.03)',
    backdropFilter: 'blur(6px)'
  };

  const notch = {
    position: 'absolute',
    top: 6,
    left: '50%',
    transform: 'translateX(-50%)',
    width: 140,
    height: 24,
    borderRadius: 12,
    background: 'rgba(0,0,0,0.45)',
    zIndex: 6,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12
  };


   const messageBlock = {
    marginTop: 8,
    display: 'flex',
    flexDirection: 'column',
    background: 'linear-gradient(90deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))',
    borderRadius: 16,
    padding: 12,
    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.02), 0 8px 20px rgba(5,8,20,0.4)',
    color: "white",
   };

  return (
    <>
      <div style={phone}>
        <div style={screen}>
          <div style={animatedBg} aria-hidden />

          <div style={notch}>TvOS</div>

          <div style={statusBar}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <WifiOff />
              <BatteryLow />
            </div>

            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <div style={timeStyle}>5:54</div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>

              </div>
            </div>

          </div>

          <div style={homeArea}>

            <div style={widget}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <div style={{ width: 58, height: 58, borderRadius: 12, background: 'linear-gradient(135deg, #ff6f91, #845ef7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, boxShadow: '0 8px 20px rgba(133,94,247,0.28)' }}>
                  +
                </div>
                
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "white" }}>Good morning</div>
                  <div style={{ fontSize: 12, opacity: 0.75, marginTop: 4, color: "gray", fontWeight: 700 }}>High chance of rain today.</div>
                </div>
              </div>
            </div>

            <div style={appsGrid}>
              {phoneApps.map((a, i) => (
                <div key={i} className="app-icon" style={{ ...appIcon, background: `linear-gradient(180deg, ${a.colors[0]}33, ${a.colors[1]}22)` }}>
                  <div style={{ marginTop: 5, width: 44, height: 44, borderRadius: 10, background: `linear-gradient(135deg, ${a.colors[0]}, ${a.colors[1]})`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 16px rgba(0,0,0,0.25)' }}>
                    +
                  </div>

                  <div style={{ marginTop: 8 }}>
                    {a.name}
                  </div>
                </div>
              ))}
            </div>

            <div style={messageBlock}> 
              <span style={{ontSize: 13, fontWeight: 700, color: "white" }}>Last recived message:</span>
              <span style={{ fontSize: 12, opacity: 0.75, marginTop: 4, color: "gold", fontWeight: 700 }}>
                Good morning,  <br/> <br/>
                We loved you application and want to invite you to the first stage of pre-screening test. <br/> <br/> 
                Please arrive at your local train station at 6 am tommorow for further details. <br/> <br/> 
                Some may find this sudden but we really want to see your talents before we determine whether to discuss if we should bring you into our work family!<br/> <br/> 
                Kind regards, <br/> 
                Tharusan from TvCorp  
              </span>
            </div>



          </div>

        </div>
      </div>
    </>
  );
}


import React, { useEffect, useRef } from 'react';
import { MatchState } from '../../types';

const hitUrl = 'data:audio/mpeg;base64,//uQZAAAAAAAAAAAAAAAAAAAA...'; // placeholder silent minimal
const sixUrl = hitUrl; // reuse
const wicketUrl = hitUrl; // reuse; can be replaced with real assets

const EventSounds: React.FC<{ match: MatchState; enabled: boolean }>=({ match, enabled })=>{
  const lastLen = useRef(0);
  const hitRef = useRef<HTMLAudioElement|null>(null);
  const sixRef = useRef<HTMLAudioElement|null>(null);
  const wRef = useRef<HTMLAudioElement|null>(null);
  useEffect(()=>{
    hitRef.current = new Audio(hitUrl);
    sixRef.current = new Audio(sixUrl);
    wRef.current = new Audio(wicketUrl);
  },[]);
  useEffect(()=>{
    if(!enabled) return;
    const h = match.currentOverHistory;
    if(!h) return;
    if(h.length === 0 || h.length === lastLen.current) return;
    lastLen.current = h.length;
    const last = h[h.length-1];
    if(last.includes('W')) wRef.current?.play().catch(()=>{});
    else if(last.includes('6')) sixRef.current?.play().catch(()=>{});
    else if(last.includes('4')) hitRef.current?.play().catch(()=>{});
  },[match.currentOverHistory, enabled]);
  return null;
};

export default EventSounds;
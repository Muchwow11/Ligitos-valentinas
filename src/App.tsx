import React, { useState, useEffect } from 'react';
import './styles.css';

// ================= TYPES =================
type Heart = {
  id: number;
  left: number;
  duration: number;
  size: number;
};

type Particle = {
  id: number;
  angle: number;
  distance: number;
};

type Position = {
  top: number;
  left: number;
};

// ================= APP =================
export default function App() {
  const [showQuestion, setShowQuestion] = useState<boolean>(false);
  const [accepted, setAccepted] = useState<boolean>(false);
  const [noPosition, setNoPosition] = useState<Position>({ top: 50, left: 50 });
  const [hearts, setHearts] = useState<Heart[]>([]);
  const [noClicks, setNoClicks] = useState<number>(0);
  const [showMessage, setShowMessage] = useState<boolean>(false);
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const id = Date.now() + Math.random();
      const duration = 4 + Math.random() * 3;

      setHearts((prev: Heart[]) => [
        ...prev,
        {
          id,
          left: Math.random() * 100,
          duration,
          size: 12 + Math.random() * 18,
        },
      ]);

      setTimeout(() => {
        setHearts((prev: Heart[]) => prev.filter((h) => h.id !== id));
      }, duration * 1000);
    }, 350);

    return () => clearInterval(interval);
  }, []);

  const explodeButton = () => {
    const newParticles: Particle[] = Array.from({ length: 20 }).map((_, i) => ({
      id: Date.now() + i,
      angle: Math.random() * 360,
      distance: 40 + Math.random() * 60,
    }));

    setParticles(newParticles);

    setTimeout(() => setParticles([]), 600);
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 3000);
  };

  const moveNoButton = () => {
    if (noClicks >= 9) {
      explodeButton();
      setNoClicks(10);
      return;
    }

    setNoClicks((prev) => prev + 1);

    let newTop = Math.random() * 80 + 10;
    let newLeft = Math.random() * 80 + 10;

    const dx = newLeft - 50;
    const dy = newTop - 60;
    const distance = Math.hypot(dx, dy);

    if (distance < 22) {
      const factor = 22 / (distance || 1);
      newLeft = 50 + dx * factor;
      newTop = 60 + dy * factor;
      newLeft = Math.max(10, Math.min(90, newLeft));
      newTop = Math.max(10, Math.min(90, newTop));
    }

    setNoPosition({ top: newTop, left: newLeft });
  };

  return (
    <div className="container">
      {hearts.map((heart) => (
        <div
          key={heart.id}
          className="falling-heart"
          style={{
            left: `${heart.left}%`,
            animationDuration: `${heart.duration}s`,
            width: `${heart.size}px`,
            height: `${heart.size}px`,
          }}
        />
      ))}

      {!showQuestion && (
        <div className="heart" onClick={() => setShowQuestion(true)}>
          <span className="heart-text">Ligita</span>
        </div>
      )}

      {showQuestion && !accepted && (
        <div className="card">
          <h1 className="title">Ligita, ar būsi Tajaus Valentina?</h1>

          <button className="yesButton" onClick={() => setAccepted(true)}>
            Taip ♡
          </button>

          {noClicks < 10 && (
            <button
              className={`noButton 
      ${noClicks >= 1 ? 'cracked' : ''} 
      ${noClicks >= 1 ? `cracked-${Math.min(noClicks, 9)}` : ''}`}
              data-cracks={noClicks}
              style={{ top: `${noPosition.top}%`, left: `${noPosition.left}%` }}
              onMouseEnter={moveNoButton}
              onTouchStart={(e) => {
                e.preventDefault();
                moveNoButton();
              }}
              onClick={(e) => {
                e.preventDefault();
                moveNoButton();
              }}
            >
              {noClicks >= 3 && <span className="extra-crack extra-crack1" />}
              {noClicks >= 4 && <span className="extra-crack extra-crack2" />}
              {noClicks >= 5 && <span className="extra-crack extra-crack3" />}
              Ne
            </button>
          )}

          {particles.map((p) => (
            <div
              key={p.id}
              className="particle"
              style={{
                transform: `rotate(${p.angle}deg) translate(${p.distance}px)`,
              }}
            />
          ))}
        </div>
      )}

      {accepted && (
        <div className="success">
          <img
            className="catGif"
            src="https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3bWxiM3lodnkxamo4bGE2bndnbm90eWFnZ2RsNzNienV2aW0weHUyNCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/IpeXBG7uNM6XJKUVcg/giphy.gif"
            alt="Dancing cat"
          />
          <p className="successText">
            Ligita, darai mane laimingiausiu žmogumi pasaulyje ♡
          </p>
          <p className="successText">
            Pasirašei meilės sutartį visam gyvenimui
          </p>
          <h4 className="myliuTave">Myliu tave labai labai mažute 💕</h4>
        </div>
      )}

      <div className={`notification ${showMessage ? 'show' : ''}`}>
        Nuo mano meilės nepabėgsi... 😏❤️
      </div>
    </div>
  );
}

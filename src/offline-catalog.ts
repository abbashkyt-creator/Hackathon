import type { BootstrapData } from "./types";

export const OFFLINE_BOOTSTRAP: BootstrapData = {
  player: {
    id: "offline-practice",
    handle: "OFFLINE",
    avatarUrl: null,
    provider: "guest",
    isGuest: true,
  },
  games: [
    {
      slug: "pulse-lock",
      title: "Pulse Lock",
      rule_text: "Tap when the pulse hits the live zone.",
      accent: "#c8ff00",
    },
    {
      slug: "color-clash",
      title: "Color Clash",
      rule_text: "Tap the color named, not the color shown.",
      accent: "#b06cff",
    },
    {
      slug: "stack-shift",
      title: "Stack Shift",
      rule_text: "Tap to lock each moving block in place.",
      accent: "#21d4fd",
    },
    {
      slug: "memory-grid",
      title: "Memory Grid",
      rule_text: "Watch the signal. Repeat the growing pattern.",
      accent: "#ff4fd8",
    },
    {
      slug: "meteor-dodge",
      title: "Meteor Dodge",
      rule_text: "Drag sideways. Stay clear of every meteor.",
      accent: "#ff9f1c",
    },
    {
      slug: "subway-surfers",
      title: "Subway Surfers",
      rule_text: "Swipe to dodge trains, jump barriers, and chase the highest score.",
      accent: "#ffd32a",
    },
    {
      slug: "dino-runner",
      title: "Dino Runner",
      rule_text: "Tap to jump. Survive the endless desert.",
      accent: "#4ade80",
    },
    {
      slug: "arithmetica",
      title: "ArithmeticA",
      rule_text: "Solve the math. Beat the clock.",
      accent: "#f59e0b",
    },
    {
      slug: "67-game",
      title: "67 Game",
      rule_text: "Solve rapid-fire puzzle levels before the clock runs out.",
      accent: "#fe930e",
    },
  ],
  likes: {},
  auth: { google: false, discord: false },
};

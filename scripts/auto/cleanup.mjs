#!/usr/bin/env node
/**
 * cleanup.mjs — kill leaked tiptap-ingest Chrome instances.
 * Usage: node scripts/auto/cleanup.mjs
 */
import { sweepIngestChromes } from "./lib/cdp.mjs";
sweepIngestChromes();
console.log("cleanup: all tiptap-ingest Chrome processes stopped");

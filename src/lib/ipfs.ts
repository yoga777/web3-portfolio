// IPFS URL resolver with gateway fallback (PRD FR-04).

export const IPFS_GATEWAYS = [
  "https://ipfs.io/ipfs/",
  "https://gateway.pinata.cloud/ipfs/",
  "https://cloudflare-ipfs.com/ipfs/",
] as const;

/** Extract the bare CID/path from an ipfs:// URI, a gateway URL, or a raw CID. */
export function ipfsPath(uri: string): string {
  if (!uri) return "";
  if (uri.startsWith("ipfs://")) return uri.slice("ipfs://".length).replace(/^ipfs\//, "");
  const marker = "/ipfs/";
  const idx = uri.indexOf(marker);
  if (idx >= 0) return uri.slice(idx + marker.length);
  return uri;
}

/** Convert an ipfs:// URI or CID into an HTTPS URL on the preferred gateway. */
export function resolveIpfsUrl(cid: string, gatewayIndex = 0): string {
  const path = ipfsPath(cid);
  if (!path) return "";
  if (/^https?:\/\//.test(cid) && !cid.includes("/ipfs/")) return cid;
  const gateway = IPFS_GATEWAYS[gatewayIndex % IPFS_GATEWAYS.length];
  return `${gateway}${path}`;
}

/**
 * onError handler for <img> tags: cycles to the next gateway when a load fails.
 * Usage: <img src={resolveIpfsUrl(cid)} onError={(e) => ipfsImgFallback(e, cid)} />
 */
export function ipfsImgFallback(
  event: { currentTarget: HTMLImageElement },
  cid: string,
): void {
  const img = event.currentTarget;
  const current = Number(img.dataset.ipfsGateway ?? "0");
  const next = current + 1;
  if (next < IPFS_GATEWAYS.length) {
    img.dataset.ipfsGateway = String(next);
    img.src = resolveIpfsUrl(cid, next);
  }
}

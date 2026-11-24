// ABI for contracts/PortfolioRegistry.sol — keep in sync with the Solidity source.
// Contract address comes from NEXT_PUBLIC_CONTRACT_ADDRESS. The zero address
// means "not deployed yet": UI must disable on-chain actions in that case.
export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000" as const;

export const contractAddress = (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ||
  ZERO_ADDRESS) as `0x${string}`;

export const isContractDeployed = contractAddress !== ZERO_ADDRESS;

export const portfolioRegistryAbi = [
  {
    type: "function",
    name: "signGuestbook",
    stateMutability: "payable",
    inputs: [{ name: "_message", type: "string" }],
    outputs: [],
  },
  {
    type: "function",
    name: "endorseSkill",
    stateMutability: "nonpayable",
    inputs: [{ name: "_skillName", type: "string" }],
    outputs: [],
  },
  {
    type: "function",
    name: "getGuestbookEntries",
    stateMutability: "view",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "tuple[]",
        components: [
          { name: "sender", type: "address" },
          { name: "message", type: "string" },
          { name: "timestamp", type: "uint256" },
          { name: "tipAmount", type: "uint256" },
        ],
      },
    ],
  },
  {
    type: "function",
    name: "getGuestbookCount",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "endorsementCount",
    stateMutability: "view",
    inputs: [{ name: "_skillName", type: "string" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "hasEndorsed",
    stateMutability: "view",
    inputs: [
      { name: "endorser", type: "address" },
      { name: "skillName", type: "string" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
  {
    type: "event",
    name: "NewGuestbookEntry",
    inputs: [
      { name: "sender", type: "address", indexed: true },
      { name: "message", type: "string", indexed: false },
      { name: "timestamp", type: "uint256", indexed: false },
      { name: "tipAmount", type: "uint256", indexed: false },
    ],
  },
  {
    type: "event",
    name: "SkillEndorsed",
    inputs: [
      { name: "endorser", type: "address", indexed: true },
      { name: "skillName", type: "string", indexed: false },
      { name: "newCount", type: "uint256", indexed: false },
    ],
  },
] as const;

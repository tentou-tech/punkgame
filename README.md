# PUNKGAME

Punkgame is a **Web3-powered manga platform** that enables users to **explore, collect, and support manga creators** using blockchain technology. Built with **Next.js, React, and Story Protocol integration**, Punkgame offers a decentralized way to engage with manga content.

## Features

- **Decentralized Manga Library** – Browse and read manga stored on the blockchain.
- **NFT Manga Collection** – Collect and own manga as NFTs.
- **Creator Support System** – Support manga artists directly via crypto payments.
- **Community & Social Features** – Engage with other readers and share collections.
- **On-Chain Publishing** – Manga creators can publish their works on the blockchain.

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- pnpm / npm / yarn

### Installation

1. Clone the repository:

    ```sh
    git clone git@github.com:tentou-tech/punkgame.git
    cd punkgame
    ```

2. Install dependencies:

    ```sh
    pnpm install
    # or
    yarn install
    ```

3. Set up configuration file:

    The application uses a `config.json` file located in the `public` folder. Ensure you have a valid configuration file:

    ```json
    {
      "REDIRECT_URL": "https://app.dev.punkga.me",
      "CHAIN_ID": "aura_6321-3",
      "CHAIN_INFO": {
        "chainId": "aura_6321-3",
        "evmChainId": 6321,
        "chainName": "Aura Euphoria TestNet",
        "rpc": [
          "https://rpc.euphoria.aura.network",
          "https://jsonrpc.euphoria.aura.network"
        ],
        "indexerV2": "https://indexer-v2.staging.aurascan.io/api/v2/graphql",
        "nativeCurrency": {
          "name": "Aura",
          "symbol": "EAURA",
          "decimals": 18
        },
        "explorer": "https://euphoria.aurascan.io"
      },
      "API_URL": "https://hasura.dev.punkga.me",
      "AUTHORIZER_URL": "https://auth.dev.punkga.me",
      "AUTHORIZER_CLIENT_ID": "abd40c73-3390-4613-bc44-b5bde4796d03",
      "ADMIN_URL": "https://admin.dev.punkga.me",
      "REST_API_URL": "https://api.dev.punkga.me",
      "IN_MAINTENANCE_MODE": false,
      "GTM_ID": "GTM-PF4MH72V",
      "SEEKHYPE_URL": "https://staging.seekhype.io/",
      "WALLET_CONNECT_PROJECT_ID": "ec40291093ad80fa0def54b1fb44c8ef",
      "RECAPCHA_SITE_KEY": "6LdHgn4qAAAAAMUPupCUp2q0nBdy9hl7qnILdbL5",
      "DP_ADDRESS": "0x0bA0E052b993E8486AA8dab82c361404F7576573",
      "EVENT_START": "2025-01-31T00:00:00",
      "STORY_EXPLORER_URL": "https://explorer.story.foundation"
    }
    ```

4. Run the development server:

    ```sh
    pnpm run dev
    # or
    yarn dev
    ```

    Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `app/` – Next.js application pages and components.
- `lib/` – Utility functions and blockchain integration.
- `api/` – API routes for authentication, manga storage, and transactions.
- `public/` – Static assets and configuration file.
- `styles/` – Global styles.
- `components/` – Core UI components.
- `hooks/` – Custom React hooks.

## Deployment

Deploy the application on **Vercel, Netlify, or any Next.js-compatible hosting service**.

1. Build the application:

    ```sh
    pnpm run build
    # or
    yarn build
    ```

2. Start the application:

    ```sh
    pnpm start
    # or
    yarn start
    ```

## Contributing

Contributions are welcome! Open an issue or submit a pull request.

## License

This project is licensed under the **MIT License**.


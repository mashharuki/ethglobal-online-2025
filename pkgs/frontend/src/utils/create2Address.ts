import { keccak256, toHex } from 'viem';

/**
 * CREATE2アドレス計算ユーティリティ
 * スマートコントラクトと同じロジックを使用してアドレスを事前計算
 */

export interface Create2Params {
  factory: string;
  salt: string;
  bytecode: string;
}

/**
 * CREATE2アドレスを計算する
 * @param factory ファクトリーコントラクトアドレス
 * @param salt ソルト値（プロジェクト固有）
 * @param bytecode デプロイするコントラクトのバイトコード
 * @returns 計算されたアドレス
 */
export function calculateCreate2Address({ factory, salt, bytecode }: Create2Params): string {
  // CREATE2の計算式: keccak256(0xff + factory + salt + keccak256(bytecode))
  const bytecodeHash = keccak256(toHex(bytecode));
  const saltHex = salt.startsWith('0x') ? salt : `0x${salt}`;
  const factoryHex = factory.startsWith('0x') ? factory : `0x${factory}`;

  // 0xff + factory + salt + bytecodeHash を結合
  const input = `0xff${factoryHex.slice(2)}${saltHex.slice(2)}${bytecodeHash.slice(2)}`;

  // keccak256を計算
  const hash = keccak256(toHex(input));

  // 最後の20バイト（40文字）を取得してアドレスとして返す
  return `0x${hash.slice(-40)}`;
}

/**
 * プロジェクト用のソルト値を生成
 * @param projectName プロジェクト名
 * @param targetToken 目標トークン
 * @param targetChain 目標チェーン
 * @returns プロジェクト固有のソルト値
 */
export function generateProjectSalt(
  projectName: string,
  targetToken: string,
  targetChain: string
): string {
  const saltData = `${projectName}-${targetToken}-${targetChain}-${Date.now()}`;
  return keccak256(toHex(saltData));
}

/**
 * マルチチェーン対応のCREATE2アドレスを計算
 * @param projectName プロジェクト名
 * @param targetToken 目標トークン
 * @param targetChain 目標チェーン
 * @returns 各チェーンでのアドレス（実際には同じアドレスになる）
 */
export function calculateMultiChainAddress(
  projectName: string,
  targetToken: string,
  targetChain: string
): Record<string, string> {
  const salt = generateProjectSalt(projectName, targetToken, targetChain);

  // 各チェーンのファクトリーアドレス（テストネット用）
  const factories = {
    Sepolia: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    'Arbitrum Sepolia': '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    'Base Sepolia': '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    'Optimism Sepolia': '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    'Polygon Amoy': '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
  };

  // デプロイするコントラクトのバイトコード（実際のコントラクトのバイトコード）
  const bytecode = '0x608060405234801561001057600080fd5b50600436106100365760003560e01c8063...'; // 実際のバイトコード

  const addresses: Record<string, string> = {};

  Object.entries(factories).forEach(([chain, factory]) => {
    addresses[chain] = calculateCreate2Address({
      factory,
      salt,
      bytecode,
    });
  });

  return addresses;
}

/**
 * アドレスがマルチチェーンで同一かどうかを検証
 * @param addresses 各チェーンのアドレス
 * @returns 全てのアドレスが同一かどうか
 */
export function verifyMultiChainConsistency(addresses: Record<string, string>): boolean {
  const addressValues = Object.values(addresses);
  if (addressValues.length === 0) return false;

  const firstAddress = addressValues[0];
  return addressValues.every((address) => address === firstAddress);
}


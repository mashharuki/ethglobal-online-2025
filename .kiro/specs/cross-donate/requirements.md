# CrossDonate Requirements Document

## Introduction

CrossDonateは、Web3寄付エコシステムにおけるトークンとチェーンの断片化問題を解決する、ユニバーサル寄付受取プラットフォームです。

寄付者は任意のチェーン・トークンから単一の統一アドレスに送金するだけで、運営者が指定したトークン・チェーンに自動変換・集約される革新的なUXを提供します。

Hardhat V3を使用した開発環境で、Sepolia・Arbitrum Sepoliaテストネットでの動作を実現します。

## Requirements

### Requirement 1: 統一寄付アドレスシステム

**User Story:** プロジェクト運営者として、複数のEVMチェーンで同一アドレスを持つ寄付受取システムを設定したい。これにより、寄付者に単一のアドレスを提示でき、チェーンごとに異なるアドレスを管理する必要がなくなる。

#### Acceptance Criteria

1. WHEN プロジェクト運営者がCrossDonateプラットフォームでプロジェクトを作成する THEN システムはCREATE2を使用してSepolia・Arbitrum Sepoliaで同一アドレスのDonationPoolコントラクトをデプロイする
2. WHEN 寄付者が統一アドレスを確認する THEN 全ての対応チェーンで同じアドレスが表示される
3. WHEN DonationPoolコントラクトがデプロイされる THEN コントラクトの所有権は運営者のEOAアドレスに設定される
4. WHEN 開発環境を構築する THEN Hardhat V3を使用してスマートコントラクトの開発・テスト・デプロイを行う

### Requirement 2: 自動スワップ・集約機能

**User Story:** プロジェクト運営者として、様々なチェーンとトークンで受け取った寄付を、指定した単一のトークン・チェーン（例：Arbitrum Sepolia USDC）に自動変換・集約したい。これにより、資産管理の複雑さを解消し、会計処理を簡素化できる。

#### Acceptance Criteria

1. WHEN 寄付者が対応トークン（ETH、USDC、PYUSD等）を統一アドレスに送金する THEN DonationPoolコントラクトは寄付を受け取り、寄付イベントを発行する
2. WHEN 運営者が集約処理を実行する THEN Avail Nexus SDKを使用して各チェーンの寄付トークンを指定されたターゲットチェーン・トークンにスワップ・ブリッジする
3. WHEN 集約処理が完了する THEN 全ての寄付が運営者指定のチェーン・トークン（Arbitrum Sepolia USDC）に統合される
4. IF ガス代が不足している場合 THEN システムは自動的にガス代を補充してから集約処理を実行する

### Requirement 3: シンプルなセキュリティシステム

**User Story:** プロジェクト運営者として、寄付資金の引き出しを安全に管理したい。MVPでは複雑な分散署名ではなく、シンプルな所有者ベースのアクセス制御で資金の安全性を確保したい。

#### Acceptance Criteria

1. WHEN プロジェクトが作成される THEN DonationPoolコントラクトの所有者は運営者のEOAアドレスに設定される
2. WHEN 資金引き出しが要求される THEN 所有者のみが引き出し機能を実行できる
3. WHEN 所有者以外が引き出しを試行する THEN トランザクションは失敗し、適切なエラーメッセージが表示される
4. WHEN 集約処理が実行される THEN 所有者の署名により安全にAvail Nexus経由での変換が実行される

### Requirement 4: 管理者ダッシュボード

**User Story:** プロジェクト運営者として、全チェーン(ハッカソン期間のゴールは、Sepolia・Arbitrum Sepoliaの2つのみで良い)の寄付残高を一覧で確認し、ワンクリックで集約・引き出し処理を実行できるダッシュボードが欲しい。これにより、複雑な手動操作なしに資金管理ができる。

#### Acceptance Criteria

1. WHEN 運営者がダッシュボードにアクセスする THEN Sepolia・Arbitrum Sepoliaの寄付残高がリアルタイムで表示される
2. WHEN 運営者が「Convert & Withdraw」ボタンをクリックする THEN ウォレット接続による署名フローが開始される
3. WHEN 運営者の署名が完了する THEN 自動スワップ・ブリッジ・集約処理が実行される
4. WHEN 処理が完了する THEN 寄付履歴と処理結果がダッシュボードに表示される

### Requirement 5: 寄付者向けシンプルUX

**User Story:** 寄付者として、どのチェーンのどんなトークンを持っていても、プロジェクトの統一アドレスに送金するだけで寄付を完了したい。複雑なブリッジやスワップ操作は不要にしたい。

#### Acceptance Criteria

1. WHEN 寄付者がプロジェクトページを訪問する THEN 統一寄付アドレスとQRコードが表示される
2. WHEN 寄付者が対応チェーン・トークンを確認する THEN サポートされているチェーン（Sepolia、Arbitrum Sepolia）とトークン（ETH、USDC、PYUSD等）のリストが表示される
3. WHEN 寄付者が統一アドレスに送金する THEN トランザクションが成功し、寄付完了メッセージが表示される
4. WHEN 寄付が完了する THEN 寄付者に寄付証明（レシート）が提供される

### Requirement 6: リアルタイム寄付追跡

**User Story:** プロジェクト運営者と寄付者として、寄付の状況をリアルタイムで追跡したい。これにより、透明性を確保し、信頼性を向上させたい。

#### Acceptance Criteria

1. WHEN 寄付が実行される THEN 寄付イベントがブロックチェーンに記録される
2. WHEN 寄付イベントが発生する THEN リアルタイムで寄付履歴が更新される
3. WHEN 集約処理が実行される THEN 処理状況がリアルタイムで表示される
4. WHEN ユーザーが寄付履歴を確認する THEN 寄付者アドレス、金額、チェーン、タイムスタンプが表示される

### Requirement 7: MVPスコープ制限

**User Story:** 開発チームとして、2週間のハッカソン期間内で実装可能なMVPスコープに機能を制限したい。これにより、コア機能に集中し、動作するプロダクトを確実に完成させたい。

#### Acceptance Criteria

1. WHEN MVPを定義する THEN 対応チェーンをSepolia、Arbitrum Sepoliaの2チェーンに限定する
2. WHEN MVPを定義する THEN 対応トークンをETH、USDC、PYUSDに限定する
3. WHEN MVPを定義する THEN ターゲットチェーンをArbitrum Sepolia、ターゲットトークンをUSDCに固定する
4. WHEN MVPを定義する THEN 開発環境はHardhat V3を使用し、UI/UXは必要最小限の機能に絞る
5. WHEN MVPを定義する THEN 複雑な分散署名システムは使用せず、シンプルな所有者ベースのアクセス制御を採用する
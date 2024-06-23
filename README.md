# フロントエンド環境構築と実行手順

このプロジェクトは、Create React Appを使用して作成されています。

## 環境構築

1. Node.jsをインストールしてください。(https://nodejs.org/)
2. プロジェクトのfrontendディレクトリで以下のコマンドを実行し、依存関係をインストールしてください。
   ```
   npm install
   ```
3. backend/app.py内の、YOUR_ANTHROPIC_APIKEYを、自身のAnthropic APIキーに変更してください。

## 実行手順

プロジェクトのルートディレクトリで以下のコマンドを実行してください。
   ```
   npm start
   ```

アプリケーションを開発モードで実行します。
ブラウザで [http://localhost:3000](http://localhost:3000) を開いて確認できます。

ファイルを変更すると、ページが自動的にリロードされます。
コンソールにlintエラーも表示されます。

# バックエンド環境構築と実行手順 

## 環境構築

1. Python 3.xをインストールしてください。(https://www.python.org/)
2. プロジェクトのバックエンドディレクトリ（ `backend`）に移動し、以下のコマンドを実行して仮想環境を作成してください。
   ```
   python -m venv venv
   ```
3. 仮想環境をアクティベートしてください。
   - Windowsの場合:
     ```
     venv\Scripts\activate
     ```
   - macOS/Linuxの場合:
     ```
     source venv/bin/activate
     ```
4. 以下のコマンドを実行して、必要なPythonパッケージをインストールしてください。
   ```
   pip install -r requirements.txt
   ```

## 実行手順

1. 仮想環境がアクティベートされていることを確認してください。
2. バックエンドディレクトリ（例: `backend`）で以下のコマンドを実行して、Flaskサーバーを起動してください。
   ```
   cd backend
   python app.py
   ```
3. サーバーが正常に起動すると、コンソールにURLが表示されます（例: `http://localhost:5000`）。

これで、フロントエンドとバックエンドの両方が実行され、アプリケーションが動作するはずです。フロントエンドのURLにアクセスして、アプリケーションを使用できます。

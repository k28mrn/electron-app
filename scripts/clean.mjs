/**
 * 各プロジェクトフォルダの node_modules とビルド成果物を削除して PC の容量を空けるスクリプト
 * 使い方: リポジトリ直下で `npm run clean`
 * 再び使うときは各プロジェクトフォルダで `npm install` し直す
 */
import { existsSync, lstatSync, readdirSync, rmSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

/** リポジトリのルートディレクトリ */
const ROOT_DIR = fileURLToPath(new URL('..', import.meta.url));

/**
 * 削除対象のフォルダ名
 * NOTE: build/ はアイコン等の electron-builder 用素材置き場なので対象外
 */
const TARGET_DIR_NAMES = ['node_modules', 'out', 'dist'];

/**
 * ルート直下から package.json を持つプロジェクトフォルダを列挙する
 * @returns {string[]} プロジェクトフォルダの絶対パス一覧
 */
function findProjectDirs() {
	return readdirSync(ROOT_DIR, { withFileTypes: true })
		.filter((entry) => entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules')
		.map((entry) => join(ROOT_DIR, entry.name))
		.filter((dirPath) => existsSync(join(dirPath, 'package.json')));
}

/**
 * フォルダ配下の合計ファイルサイズを再帰的に求める
 * シンボリックリンクは辿らずリンク自体のサイズとして数える
 * @param {string} dirPath 対象フォルダの絶対パス
 * @returns {number} 合計サイズ（バイト）
 */
function getDirSize(dirPath) {
	let total = 0;
	for (const entry of readdirSync(dirPath, { withFileTypes: true })) {
		const entryPath = join(dirPath, entry.name);
		total += entry.isDirectory() ? getDirSize(entryPath) : lstatSync(entryPath).size;
	}
	return total;
}

/**
 * バイト数を人が読みやすい単位の文字列に変換する
 * @param {number} bytes バイト数
 * @returns {string} 例: "512.3 MB"
 */
function formatBytes(bytes) {
	const units = ['B', 'KB', 'MB', 'GB'];
	let value = bytes;
	let unitIndex = 0;
	while (value >= 1024 && unitIndex < units.length - 1) {
		value /= 1024;
		unitIndex++;
	}
	// バイト単位のときは小数点を付けない
	return `${unitIndex === 0 ? value : value.toFixed(1)} ${units[unitIndex]}`;
}

/**
 * 全プロジェクトの削除対象フォルダを削除し、結果を表示する
 */
function main() {
	let removedCount = 0;
	let freedBytes = 0;
	const failedPaths = [];

	for (const projectDir of findProjectDirs()) {
		for (const dirName of TARGET_DIR_NAMES) {
			const targetPath = join(projectDir, dirName);
			if (!existsSync(targetPath)) continue;

			const label = relative(ROOT_DIR, targetPath);
			try {
				// サイズ計算の失敗は削除の妨げにしない
				let size = 0;
				try {
					size = getDirSize(targetPath);
				} catch {
					size = 0;
				}

				// Windows でファイルが一時的にロックされている場合に備えてリトライする
				rmSync(targetPath, { recursive: true, force: true, maxRetries: 3 });
				removedCount++;
				freedBytes += size;
				console.log(`[clean] 削除: ${label} (${formatBytes(size)})`);
			} catch (error) {
				failedPaths.push(label);
				console.error(`[clean] 失敗: ${label} - ${error instanceof Error ? error.message : error}`);
			}
		}
	}

	if (removedCount === 0 && failedPaths.length === 0) {
		console.log('[clean] 削除対象はありませんでした');
		return;
	}

	console.log(`[clean] 完了: ${removedCount} フォルダを削除し、約 ${formatBytes(freedBytes)} を空けました`);

	if (failedPaths.length > 0) {
		console.error('[clean] 削除できなかったフォルダがあります。アプリやエディタを終了してから再度実行してください');
		process.exitCode = 1;
	}
}

main();

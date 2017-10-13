declare var require: {
	<T>(path: string): T;
	(paths: string[], callback: (...modules: {}[]) => void): void;
	ensure: (paths: string[], callback: (require: <T>(path: string) => T) => void) => void;
};

require('file?name=[name].[ext]!./index.html');

import boot from './core/boot';

boot();
{
    "compilerOptions": {
        "module": "commonjs",
        "moduleResolution": "node",
        "emitDecoratorMetadata": true,
        "experimentalDecorators": true,
        "removeComments": false,
        "noImplicitAny": false,
        "allowJs": true,
        "outDir": "./build",
        "baseUrl": "./app",
        "paths": {"common/types": ["app/common"]},
        "sourceMap": true
    },
    "include": ["node_modules/@types/**/*.d.ts", "app/common/types.d.ts", "app/server/boot.ts"]
}

For decorator, we need `reflect-metadata` package. It is used to store metadata in the class. Also needs to twick the 
`tsconfig.json` file to enable the `experimentalDecorators` and `emitDecoratorMetadata` options. Also 
`useDefineForClassFields: false` for to get access to properties or parameters of the class. 

```bash 

```json
{
  "compilerOptions": {
    ...
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "useDefineForClassFields": false
  }
}
```

44:24
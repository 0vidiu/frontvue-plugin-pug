declare const _default: ({
    description: string;
    hook: string;
    name: string;
    taskFn: (done: any, { logger, paths, gulp }?: any) => Promise<any>;
    configDefaults: {
        sourceDir: string;
        buildDir: string;
    };
    configQuestionnaire: {
        namespace: string;
        questions: {
            default: string;
            message: string;
            name: string;
            type: string;
        }[];
    };
} | {
    description: string;
    hook: string;
    name: string;
    taskFn: (done: any, { logger, config, paths, env, gulp }?: any) => Promise<any>;
    configDefaults?: undefined;
    configQuestionnaire?: undefined;
})[];
export default _default;

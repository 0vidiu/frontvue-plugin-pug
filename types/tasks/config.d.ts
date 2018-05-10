declare const _default: {
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
};
export default _default;

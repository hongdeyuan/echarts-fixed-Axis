interface GenerateAxisOption {
    /**
     * Maximum data
     *
     * @type {(number | undefined)}
     * @memberof GenerateAxisOption
     */
    max: number | undefined;
    /**
     * Data minimum
     * @type {(number | undefined)}
     * @memberof GenerateAxisOption
     */
    min: number | undefined;
    /**
     * Expected to be divided into several intervals
     *
     * @type {number}
     * @memberof GenerateAxisOption
     */
    splitNumber?: number;
    /**
     * Whether the positive and negative intervals need to be symmetric when there are data with different signs
     *
     * @type {boolean}
     * @memberof GenerateAxisOption
     */
    symmetrical?: boolean;
    /**
     * Whether to allow errors in the number of intervals actually divided
     *
     * @type {boolean}
     * @memberof GenerateAxisOption
     */
    deviation?: boolean;
    /**
     * Whether to take priority to 0 scale
     *
     * @type {boolean}
     * @memberof GenerateAxisOption
     */
    preferZero?: boolean;
    /**
     * Ideal scale value
     *
     * @type {number[]}
     * @memberof GenerateAxisOption
     */
    magics?: number[];
}
interface GenerateAxisResult {
    max?: number;
    min?: number;
    interval?: number;
    splitNumber?: number;
}
type Axis = Record<string, any>;
type SerieItem = {
    data: [number, number][];
    [x: string]: any;
};
interface FixedAxisOption {
    axis: Axis;
    series: SerieItem[];
    splitNumber?: number;
    magics?: number[];
}
export type { Axis, FixedAxisOption, GenerateAxisOption, GenerateAxisResult, SerieItem };

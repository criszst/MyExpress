"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.flatten = void 0;
/**
 * Achata arrays aninhados em um único nível.
 *
 * [1, [2, [3, 4], 5], 6, [7, [8, [9]]]] -> [1, 2, 3, 4, 5, 6, 7, 8, 9]
 *
 * @param arr Array que será achatado.
 * @return Array achatado.
 */
const flatten = (arr) => {
    return arr.reduce((flat, recFlatten) => {
        return flat.concat(Array.isArray(recFlatten) ? (0, exports.flatten)(recFlatten) : [recFlatten]);
    }, []);
};
exports.flatten = flatten;

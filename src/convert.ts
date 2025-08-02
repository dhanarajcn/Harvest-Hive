const TODAY_CONVERSION_RATE = 0.00161490;

export function convertToINR(wei: number): number {
    return wei * TODAY_CONVERSION_RATE;
}
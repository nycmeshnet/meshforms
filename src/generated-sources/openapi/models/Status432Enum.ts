/* tslint:disable */
/* eslint-disable */
/**
 * MeshDB Data API
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 1.0.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


/**
 * * `Inactive` - Inactive
 * * `Active` - Active
 * * `Potential` - Potential
 * @export
 */
export const Status432Enum = {
    Inactive: 'Inactive',
    Active: 'Active',
    Potential: 'Potential'
} as const;
export type Status432Enum = typeof Status432Enum[keyof typeof Status432Enum];


export function instanceOfStatus432Enum(value: any): boolean {
    for (const key in Status432Enum) {
        if (Object.prototype.hasOwnProperty.call(Status432Enum, key)) {
            if (Status432Enum[key as keyof typeof Status432Enum] === value) {
                return true;
            }
        }
    }
    return false;
}

export function Status432EnumFromJSON(json: any): Status432Enum {
    return Status432EnumFromJSONTyped(json, false);
}

export function Status432EnumFromJSONTyped(json: any, ignoreDiscriminator: boolean): Status432Enum {
    return json as Status432Enum;
}

export function Status432EnumToJSON(value?: Status432Enum | null): any {
    return value as any;
}


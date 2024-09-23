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

import { mapValues } from '../runtime';
/**
 * A reference to a Building object, via one or more of the following keys: ['id']
 * @export
 * @interface NodeBuildingsInner
 */
export interface NodeBuildingsInner {
    /**
     * 
     * @type {string}
     * @memberof NodeBuildingsInner
     */
    id?: string;
}

/**
 * Check if a given object implements the NodeBuildingsInner interface.
 */
export function instanceOfNodeBuildingsInner(value: object): value is NodeBuildingsInner {
    return true;
}

export function NodeBuildingsInnerFromJSON(json: any): NodeBuildingsInner {
    return NodeBuildingsInnerFromJSONTyped(json, false);
}

export function NodeBuildingsInnerFromJSONTyped(json: any, ignoreDiscriminator: boolean): NodeBuildingsInner {
    if (json == null) {
        return json;
    }
    return {
        
        'id': json['id'] == null ? undefined : json['id'],
    };
}

export function NodeBuildingsInnerToJSON(value?: NodeBuildingsInner | null): any {
    if (value == null) {
        return value;
    }
    return {
        
        'id': value['id'],
    };
}


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
 * 
 * @export
 * @interface ErrorResponseInvalidAddr
 */
export interface ErrorResponseInvalidAddr {
    /**
     * 
     * @type {string}
     * @memberof ErrorResponseInvalidAddr
     */
    detail: string;
}

/**
 * Check if a given object implements the ErrorResponseInvalidAddr interface.
 */
export function instanceOfErrorResponseInvalidAddr(value: object): value is ErrorResponseInvalidAddr {
    if (!('detail' in value) || value['detail'] === undefined) return false;
    return true;
}

export function ErrorResponseInvalidAddrFromJSON(json: any): ErrorResponseInvalidAddr {
    return ErrorResponseInvalidAddrFromJSONTyped(json, false);
}

export function ErrorResponseInvalidAddrFromJSONTyped(json: any, ignoreDiscriminator: boolean): ErrorResponseInvalidAddr {
    if (json == null) {
        return json;
    }
    return {
        
        'detail': json['detail'],
    };
}

export function ErrorResponseInvalidAddrToJSON(value?: ErrorResponseInvalidAddr | null): any {
    if (value == null) {
        return value;
    }
    return {
        
        'detail': value['detail'],
    };
}


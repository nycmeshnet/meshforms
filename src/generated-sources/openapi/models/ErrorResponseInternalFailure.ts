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
 * @interface ErrorResponseInternalFailure
 */
export interface ErrorResponseInternalFailure {
    /**
     * 
     * @type {string}
     * @memberof ErrorResponseInternalFailure
     */
    detail: string;
}

/**
 * Check if a given object implements the ErrorResponseInternalFailure interface.
 */
export function instanceOfErrorResponseInternalFailure(value: object): value is ErrorResponseInternalFailure {
    if (!('detail' in value) || value['detail'] === undefined) return false;
    return true;
}

export function ErrorResponseInternalFailureFromJSON(json: any): ErrorResponseInternalFailure {
    return ErrorResponseInternalFailureFromJSONTyped(json, false);
}

export function ErrorResponseInternalFailureFromJSONTyped(json: any, ignoreDiscriminator: boolean): ErrorResponseInternalFailure {
    if (json == null) {
        return json;
    }
    return {
        
        'detail': json['detail'],
    };
}

export function ErrorResponseInternalFailureToJSON(value?: ErrorResponseInternalFailure | null): any {
    if (value == null) {
        return value;
    }
    return {
        
        'detail': value['detail'],
    };
}


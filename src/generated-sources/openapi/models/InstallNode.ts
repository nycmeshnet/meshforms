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
 * The node this install is associated with. This node's network_number field corresponds to the static IP address and OSPF ID of the router this install utilizes, the DHCP range it receives an address from, etc.
 * @export
 * @interface InstallNode
 */
export interface InstallNode {
    /**
     * 
     * @type {string}
     * @memberof InstallNode
     */
    id?: string;
    /**
     * 
     * @type {number}
     * @memberof InstallNode
     */
    networkNumber?: number | null;
}

/**
 * Check if a given object implements the InstallNode interface.
 */
export function instanceOfInstallNode(value: object): value is InstallNode {
    return true;
}

export function InstallNodeFromJSON(json: any): InstallNode {
    return InstallNodeFromJSONTyped(json, false);
}

export function InstallNodeFromJSONTyped(json: any, ignoreDiscriminator: boolean): InstallNode {
    if (json == null) {
        return json;
    }
    return {
        
        'id': json['id'] == null ? undefined : json['id'],
        'networkNumber': json['network_number'] == null ? undefined : json['network_number'],
    };
}

export function InstallNodeToJSON(value?: InstallNode | null): any {
    if (value == null) {
        return value;
    }
    return {
        
        'id': value['id'],
        'network_number': value['networkNumber'],
    };
}


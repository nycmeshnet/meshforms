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
import type { Status432Enum } from './Status432Enum';
import {
    Status432EnumFromJSON,
    Status432EnumFromJSONTyped,
    Status432EnumToJSON,
} from './Status432Enum';
import type { AccessPointNode } from './AccessPointNode';
import {
    AccessPointNodeFromJSON,
    AccessPointNodeFromJSONTyped,
    AccessPointNodeToJSON,
} from './AccessPointNode';
import type { AccessPointLinksFromInner } from './AccessPointLinksFromInner';
import {
    AccessPointLinksFromInnerFromJSON,
    AccessPointLinksFromInnerFromJSONTyped,
    AccessPointLinksFromInnerToJSON,
} from './AccessPointLinksFromInner';

/**
 * A  ModelSerializer MixIn which sets `NestedKeyObjectRelatedField` as the default field class
 * to use for the foreign key fields
 * @export
 * @interface AccessPoint
 */
export interface AccessPoint {
    /**
     * 
     * @type {string}
     * @memberof AccessPoint
     */
    readonly id: string;
    /**
     * 
     * @type {Array<AccessPointLinksFromInner>}
     * @memberof AccessPoint
     */
    readonly linksFrom: Array<AccessPointLinksFromInner>;
    /**
     * 
     * @type {Array<AccessPointLinksFromInner>}
     * @memberof AccessPoint
     */
    readonly linksTo: Array<AccessPointLinksFromInner>;
    /**
     * The name of this device, usually configured as the hostname in the device firmware, usually in the format nycmesh-xxxx-yyyy-zzzz, where xxxx is the network number for the node this device is located at, yyyy is the type of the device, and zzzz is the network number of the other side of the link this device creates (if applicable)
     * @type {string}
     * @memberof AccessPoint
     */
    name?: string | null;
    /**
     * The current status of this device
     * 
     * * `Inactive` - Inactive
     * * `Active` - Active
     * * `Potential` - Potential
     * @type {Status432Enum}
     * @memberof AccessPoint
     */
    status: Status432Enum;
    /**
     * The date this device first became active on the mesh
     * @type {Date}
     * @memberof AccessPoint
     */
    installDate?: Date | null;
    /**
     * The this device was abandoned, unplugged, or removed from service
     * @type {Date}
     * @memberof AccessPoint
     */
    abandonDate?: Date | null;
    /**
     * A free-form text description of this Device, to track any additional information. For imported Devices, this starts with a formatted block of information about the import processand original data. However this structure can be changed by admins at any time and should not be relied onby automated systems. 
     * @type {string}
     * @memberof AccessPoint
     */
    notes?: string | null;
    /**
     * The UUID used to indentify this device in UISP (if applicable)
     * @type {string}
     * @memberof AccessPoint
     */
    uispId?: string | null;
    /**
     * Approximate AP latitude in decimal degrees (this will match the attached Node object in most cases, but has been manually moved around in some cases to more accurately reflect the device location)
     * @type {number}
     * @memberof AccessPoint
     */
    latitude: number;
    /**
     * Approximate AP longitude in decimal degrees (this will match the attached Node object in most cases, but has been manually moved around in some cases to more accurately reflect the device location)
     * @type {number}
     * @memberof AccessPoint
     */
    longitude: number;
    /**
     * Approximate AP altitude in "absolute" meters above mean sea level (this will match the attached Node object in most cases, but has been manually moved around in some cases to more accurately reflect the device location)
     * @type {number}
     * @memberof AccessPoint
     */
    altitude?: number | null;
    /**
     * 
     * @type {AccessPointNode}
     * @memberof AccessPoint
     */
    node: AccessPointNode;
}



/**
 * Check if a given object implements the AccessPoint interface.
 */
export function instanceOfAccessPoint(value: object): value is AccessPoint {
    if (!('id' in value) || value['id'] === undefined) return false;
    if (!('linksFrom' in value) || value['linksFrom'] === undefined) return false;
    if (!('linksTo' in value) || value['linksTo'] === undefined) return false;
    if (!('status' in value) || value['status'] === undefined) return false;
    if (!('latitude' in value) || value['latitude'] === undefined) return false;
    if (!('longitude' in value) || value['longitude'] === undefined) return false;
    if (!('node' in value) || value['node'] === undefined) return false;
    return true;
}

export function AccessPointFromJSON(json: any): AccessPoint {
    return AccessPointFromJSONTyped(json, false);
}

export function AccessPointFromJSONTyped(json: any, ignoreDiscriminator: boolean): AccessPoint {
    if (json == null) {
        return json;
    }
    return {
        
        'id': json['id'],
        'linksFrom': ((json['links_from'] as Array<any>).map(AccessPointLinksFromInnerFromJSON)),
        'linksTo': ((json['links_to'] as Array<any>).map(AccessPointLinksFromInnerFromJSON)),
        'name': json['name'] == null ? undefined : json['name'],
        'status': Status432EnumFromJSON(json['status']),
        'installDate': json['install_date'] == null ? undefined : (new Date(json['install_date'])),
        'abandonDate': json['abandon_date'] == null ? undefined : (new Date(json['abandon_date'])),
        'notes': json['notes'] == null ? undefined : json['notes'],
        'uispId': json['uisp_id'] == null ? undefined : json['uisp_id'],
        'latitude': json['latitude'],
        'longitude': json['longitude'],
        'altitude': json['altitude'] == null ? undefined : json['altitude'],
        'node': AccessPointNodeFromJSON(json['node']),
    };
}

export function AccessPointToJSON(value?: Omit<AccessPoint, 'id'|'links_from'|'links_to'> | null): any {
    if (value == null) {
        return value;
    }
    return {
        
        'name': value['name'],
        'status': Status432EnumToJSON(value['status']),
        'install_date': value['installDate'] == null ? undefined : ((value['installDate'] as any).toISOString().substring(0,10)),
        'abandon_date': value['abandonDate'] == null ? undefined : ((value['abandonDate'] as any).toISOString().substring(0,10)),
        'notes': value['notes'],
        'uisp_id': value['uispId'],
        'latitude': value['latitude'],
        'longitude': value['longitude'],
        'altitude': value['altitude'],
        'node': AccessPointNodeToJSON(value['node']),
    };
}


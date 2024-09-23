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
import type { InstallBuilding } from './InstallBuilding';
import {
    InstallBuildingFromJSON,
    InstallBuildingFromJSONTyped,
    InstallBuildingToJSON,
} from './InstallBuilding';
import type { Status195Enum } from './Status195Enum';
import {
    Status195EnumFromJSON,
    Status195EnumFromJSONTyped,
    Status195EnumToJSON,
} from './Status195Enum';
import type { InstallNode } from './InstallNode';
import {
    InstallNodeFromJSON,
    InstallNodeFromJSONTyped,
    InstallNodeToJSON,
} from './InstallNode';
import type { InstallMember } from './InstallMember';
import {
    InstallMemberFromJSON,
    InstallMemberFromJSONTyped,
    InstallMemberToJSON,
} from './InstallMember';

/**
 * A  ModelSerializer MixIn which sets `NestedKeyObjectRelatedField` as the default field class
 * to use for the foreign key fields
 * @export
 * @interface Install
 */
export interface Install {
    /**
     * 
     * @type {string}
     * @memberof Install
     */
    readonly id: string;
    /**
     * 
     * @type {number}
     * @memberof Install
     */
    readonly installNumber: number;
    /**
     * The current status of this install
     * 
     * * `Request Received` - Request Received
     * * `Pending` - Pending
     * * `Blocked` - Blocked
     * * `Active` - Active
     * * `Inactive` - Inactive
     * * `Closed` - Closed
     * * `NN Reassigned` - Nn Reassigned
     * @type {Status195Enum}
     * @memberof Install
     */
    status: Status195Enum;
    /**
     * The ticket number of the OSTicket used to track communications with the member about this install
     * @type {number}
     * @memberof Install
     */
    ticketNumber?: number | null;
    /**
     * The date that this install request was received
     * @type {Date}
     * @memberof Install
     */
    requestDate: Date;
    /**
     * The date this install was completed and deployed to the mesh
     * @type {Date}
     * @memberof Install
     */
    installDate?: Date | null;
    /**
     * The date this install was abandoned, unplugged, or disassembled
     * @type {Date}
     * @memberof Install
     */
    abandonDate?: Date | null;
    /**
     * Line 2 of this install's mailing address
     * @type {string}
     * @memberof Install
     */
    unit?: string | null;
    /**
     * True if the member indicated they had access to the roof when they submitted the join form
     * @type {boolean}
     * @memberof Install
     */
    roofAccess?: boolean;
    /**
     * The "How did you hear about us?" information provided to us when the member submitted the join form
     * @type {string}
     * @memberof Install
     */
    referral?: string | null;
    /**
     * A free-form text description of this Install, to track any additional information. For Installs imported from the spreadsheet, this starts with a formatted block of information about the import process and original spreadsheet data. However this structure can be changed by admins at any time and should not be relied on by automated systems. 
     * @type {string}
     * @memberof Install
     */
    notes?: string | null;
    /**
     * Was this install conducted by the member themselves? If not, it was done by a volunteer installer on their behalf
     * @type {boolean}
     * @memberof Install
     */
    diy?: boolean | null;
    /**
     * 
     * @type {InstallNode}
     * @memberof Install
     */
    node?: InstallNode | null;
    /**
     * 
     * @type {InstallBuilding}
     * @memberof Install
     */
    building: InstallBuilding;
    /**
     * 
     * @type {InstallMember}
     * @memberof Install
     */
    member: InstallMember;
}



/**
 * Check if a given object implements the Install interface.
 */
export function instanceOfInstall(value: object): value is Install {
    if (!('id' in value) || value['id'] === undefined) return false;
    if (!('installNumber' in value) || value['installNumber'] === undefined) return false;
    if (!('status' in value) || value['status'] === undefined) return false;
    if (!('requestDate' in value) || value['requestDate'] === undefined) return false;
    if (!('building' in value) || value['building'] === undefined) return false;
    if (!('member' in value) || value['member'] === undefined) return false;
    return true;
}

export function InstallFromJSON(json: any): Install {
    return InstallFromJSONTyped(json, false);
}

export function InstallFromJSONTyped(json: any, ignoreDiscriminator: boolean): Install {
    if (json == null) {
        return json;
    }
    return {
        
        'id': json['id'],
        'installNumber': json['install_number'],
        'status': Status195EnumFromJSON(json['status']),
        'ticketNumber': json['ticket_number'] == null ? undefined : json['ticket_number'],
        'requestDate': (new Date(json['request_date'])),
        'installDate': json['install_date'] == null ? undefined : (new Date(json['install_date'])),
        'abandonDate': json['abandon_date'] == null ? undefined : (new Date(json['abandon_date'])),
        'unit': json['unit'] == null ? undefined : json['unit'],
        'roofAccess': json['roof_access'] == null ? undefined : json['roof_access'],
        'referral': json['referral'] == null ? undefined : json['referral'],
        'notes': json['notes'] == null ? undefined : json['notes'],
        'diy': json['diy'] == null ? undefined : json['diy'],
        'node': json['node'] == null ? undefined : InstallNodeFromJSON(json['node']),
        'building': InstallBuildingFromJSON(json['building']),
        'member': InstallMemberFromJSON(json['member']),
    };
}

export function InstallToJSON(value?: Omit<Install, 'id'|'install_number'> | null): any {
    if (value == null) {
        return value;
    }
    return {
        
        'status': Status195EnumToJSON(value['status']),
        'ticket_number': value['ticketNumber'],
        'request_date': ((value['requestDate']).toISOString().substring(0,10)),
        'install_date': value['installDate'] == null ? undefined : ((value['installDate'] as any).toISOString().substring(0,10)),
        'abandon_date': value['abandonDate'] == null ? undefined : ((value['abandonDate'] as any).toISOString().substring(0,10)),
        'unit': value['unit'],
        'roof_access': value['roofAccess'],
        'referral': value['referral'],
        'notes': value['notes'],
        'diy': value['diy'],
        'node': InstallNodeToJSON(value['node']),
        'building': InstallBuildingToJSON(value['building']),
        'member': InstallMemberToJSON(value['member']),
    };
}


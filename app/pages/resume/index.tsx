import styles from '../../styles/Instances.module.css'
import { useState } from "react";
import axios from "axios";

const LOUNCH_ENDPOINT = "http://localhost:8000/api/launch";

export default function Resume({ json, page, setPage }: ({ json: JsonProps, page: number, setPage: Function })) {
    const securityGroups: Array<SecurityGroupProps> = json.security_groups;
    const instances: Array<InstanceProps> = json.instances;
    const userGroups: Array<UserGroupProps> = json.user_groups;
    const users: Array<UserProps> = json.users;


    async function launch() {
        try {
            const response = await axios.post(LOUNCH_ENDPOINT, json);
            console.log(response);
        } catch (error) {
            console.log(error);
        }
    }

    function showSecurityGroups() {
        return (
            <>
                {securityGroups.map((securityGroup: SecurityGroupProps) => (
                    <div className={styles.securityGroup} key={securityGroup.id}>
                        <p className={styles.name}>{securityGroup.name}</p>
                        <div className={styles.rulesContainer}>
                            {securityGroup.ingress.map((rule, index: number) => (
                                <div className={styles.rule} key={index}>
                                    <p className={styles.ruleTitle}>From: {rule.from_port}</p>
                                    <p className={styles.ruleTitle}>To: {rule.to_port}</p>
                                    <p className={styles.ruleTitle}>Protocol: {rule.protocol}</p>
                                    <div className={styles.cidrBlocks}>
                                        {rule.cidr_blocks.map((cidrBlock, index: number) => (
                                            <div className={styles.cidrBlock} key={index}>
                                                <p className={styles.cidrBlockTitle}>CIDR Block: {cidrBlock}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </>
        )
    }

    function showInstances() {
        return (
            <>
                {instances.map((instance: InstanceProps, k) => (
                    <div className={styles.instance} key={k}>
                        <p className={styles.name}>{instance.name}</p>
                        <p className={styles.type}>Type: {instance.instance_type}</p>
                        <div className={styles.securityGroups}>
                            {instance.security_groups_ids.map((securityGroupId, index: number) => {
                                let sgName = "";
                                securityGroups.forEach((securityGroup: SecurityGroupProps) => {
                                    if (securityGroup.id == securityGroupId) {
                                        sgName = securityGroup.name;
                                    }
                                })
                                return (
                                    <div className={styles.securityGroup} key={index}>
                                        <p className={styles.securityGroupName}>{sgName}</p>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                ))}
            </>
        )
    }

    function showUserGroups() {
        return (
            <>
                {userGroups.map((userGroup: UserGroupProps, k) => (
                    <div className={styles.userGroup} key={k}>
                        <p className={styles.name}>{userGroup.id} {userGroup.name}</p>
                        <p className={styles.description}>{userGroup.description}</p>
                        <div className={styles.restrictions}>
                            <p className={styles.restrictionsTitle}>Restrictions</p>
                            <div className={styles.actions}>
                                <p className={styles.actionsTitle}>Actions</p>
                                {userGroup.restrictions.actions.map((action, index: number) => (
                                    <div className={styles.action} key={index}>
                                        <p className={styles.actionTitle}>{action}</p>
                                    </div>
                                ))}
                            </div>
                            <div className={styles.resources}>
                                <p className={styles.resourcesTitle}>Resources</p>
                                {userGroup.restrictions.resources.map((resource, index: number) => (
                                    <div className={styles.resource} key={index}>
                                        <p className={styles.resourceTitle}>{resource}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </>
        )
    }

    function showUsers() {
        return (
            <>
                {users.map((user: UserProps, k) => (
                    <div className={styles.user} key={k}>
                        <p className={styles.name}>{user.name}</p>
                        <div className={styles.userGroupsList}>
                            <p className={styles.userGroupsTitle}>User Groups</p>
                            {user.groups_ids.map((userGroupId, index: number) => {
                                let userGroupName = "";
                                userGroups.forEach((userGroup: UserGroupProps) => {
                                    if (userGroup.id == userGroupId) {
                                        userGroupName = userGroup.name;
                                    }
                                })
                                return (
                                    <div className={styles.userGroupName} key={index}>
                                        <p className={styles.userGroupNameTitle}>{userGroupName}</p>
                                    </div>
                                )
                            })}
                        </div>
                        <div className={styles.userRestrictions}>
                            <p className={styles.userRestrictionsTitle}>Restrictions</p>
                            <div className={styles.actions}>
                                <p className={styles.actionsTitle}>Actions</p>
                                {user.restrictions.actions.map((action, index: number) => (
                                    <div className={styles.action} key={index}>
                                        <p className={styles.actionTitle}>{action}</p>
                                    </div>
                                ))}
                            </div>
                            <div className={styles.resources}>
                                <p className={styles.resourcesTitle}>Resources</p>
                                {user.restrictions.resources.map((resource, index: number) => (
                                    <div className={styles.resource} key={index}>
                                        <p className={styles.resourceTitle}>{resource}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </>
        )
    }

    return (
        <div className={styles.container}>
            <p className={styles.title}>Resume</p>

            <div className={styles.resume}>
                <div className={styles.securityGroups}>
                    <p className={styles.securityGroupsTitle}>Security Groups</p>
                    {showSecurityGroups()}
                </div>
                <div className={styles.instances}>
                    <p className={styles.instancesTitle}>Instances</p>
                    {showInstances()}
                </div>
                <div className={styles.userGroups}>
                    <p className={styles.userGroupsTitle}>User Groups</p>
                    {showUserGroups()}
                </div>
                <div className={styles.users}>
                    <p className={styles.usersTitle}>Users</p>
                    {showUsers()}
                </div>
            </div>

            <div className={styles.pageBtns}>
                <button onClick={() => setPage(page - 1)} >Previous</button>
                <p className={styles.page}>{page} / 4</p>
                <button onClick={async () => await launch()} >Launch</button>
            </div>
        </div>
    )
}
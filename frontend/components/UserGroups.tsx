import styles from '../styles/components/UserGroups.module.css'
import { useState, useEffect } from "react";


export default function UserGroups({ json, setJson }: ({ json: JsonProps, setJson: Function })) {
  const [userGroups, setUserGroups] = useState<Array<UserGroupProps>>(json.user_groups);
  useEffect(() => {
    setUserGroups(json.user_groups);
  }, [json.user_groups, setJson]);

  const [createUG, setCreateUG] = useState<boolean>(false);
  const [activeUG, setActiveUG] = useState<string>("");

  let dummy: UserGroupProps = {
    id: "",
    name: "",
    description: "",
    restrictions: {
      name: "",
      description: "",
      actions: [""],
      resources: [""],
    },
  };
  const [newUG, setNewUG] = useState<UserGroupProps>(dummy);

  function updateUserGroup(data: UserGroupProps) {
    console.log(data);
    let newJson = { ...json };
    newJson.user_groups.map((ug) => {
      console.log(ug.id, data.id);
      if (ug.id === data.id) {
        ug.name = data.name;
        ug.description = data.description;
        ug.restrictions = data.restrictions;
      }
    });
    setJson(newJson);
  }

  function deleteUserGroup(id: string) {
    let newJson = { ...json };
    newJson.user_groups = newJson.user_groups.filter((ug) => ug.id !== id);

    newJson.users.forEach((user) => {
      user.groups_ids = user.groups_ids.filter((ug) => ug !== id);
    });

    setJson(newJson);
  }

  function createUserGroup() {
    dummy = { ...newUG };
    return (
      <div className={styles.userGroupFocus}>
        <h2>Create User Group</h2>
        <div className={styles.userGroupFocusHeader}>
          <input type="text" placeholder="Name" defaultValue={newUG.name} onChange={(e) => (dummy.name = e.target.value)} />
          <input type="text" placeholder="Description" defaultValue={newUG.description} onChange={(e) => (dummy.description = e.target.value)} />
        </div>
        <br />
        <br />
        {newUG.restrictions.actions.map((action, index) => (
          <div key={index} className={styles.action}>
            <input className={styles.restrictionAction} type="text" placeholder="Action" defaultValue={action} onChange={(e) => (dummy.restrictions.actions[index] = e.target.value)} />
            {newUG.restrictions.actions.length - 1 === index && (
              <div className={styles.btns}>
                {newUG.restrictions.actions.length > 1 && (
                  <button className={styles.btn} onClick={() => {
                    dummy.restrictions.actions.splice(index, 1);
                    setNewUG(dummy);
                  }}>X</button>
                )}
                <button className={styles.btn} onClick={() => {
                  dummy.restrictions.actions.push("");
                  setNewUG(dummy);
                }}>+</button>
              </div>
            )}
          </div>
        ))}
        {newUG.restrictions.resources.map((resource, index) => (
          <div key={index} className={styles.resource}>
            <input className={styles.restrictionResource} type="text" placeholder="Resource" defaultValue={resource} onChange={(e) => (dummy.restrictions.resources[index] = e.target.value)} />
            {newUG.restrictions.resources.length - 1 === index && (
              <div className={styles.btns}>
                {newUG.restrictions.resources.length > 1 && (
                  <button className={styles.btn} onClick={() => {
                    dummy.restrictions.resources.splice(index, 1);
                    setNewUG(dummy);
                  }}>X</button>
                )}
                <button className={styles.btn} onClick={() => {
                  dummy.restrictions.resources.push("");
                  setNewUG(dummy);
                }}>+</button>
              </div>
            )}
          </div>
        ))}
        <br />
        <button className={styles.btn} onClick={() => {
          addUserGroup(dummy);
          setCreateUG(false);
        }}>Create</button>
        <button className={styles.btn} onClick={() => {
          setCreateUG(false);
        }}>Cancel</button>
      </div>
    )
  }

  function addUserGroup(data: UserGroupProps) {
    let newJson = { ...json };
    let newUg = { ...data };
    newUg.id = (json.user_groups.length + 1).toString();
    newJson.user_groups.push(newUg);
    setJson(newJson);
    setNewUG(
      {
        id: "",
        name: "",
        description: "",
        restrictions: {
          name: "",
          description: "",
          actions: [""],
          resources: [""],
        },
      }
    );
  }

  function showUserGroups() {
    return userGroups.length === 0 ? (
      <div className={styles.noUg}>
        <p>No User Groups</p>
      </div>
    ) : (
      <div className={styles.userGroups}>
        {userGroups.map((userGroup, id) => (
          <div className={styles.userGroup} key={id} onClick={() => setActiveUG(userGroup.id)}>
            <p className={styles.userGroupName}>{userGroup.name}</p>
            <p className={styles.userGroupDescription}>{userGroup.description}</p>
            <button
              className={styles.userGroupButton}
              onClick={(e) => {
                deleteUserGroup(userGroup.id);
                e.stopPropagation();
              }}
            >Delete</button>
          </div>
        ))}
      </div>
    )
  }

  function showUserGroup(index: number) {
    dummy = userGroups[index];
    return (
      <div className={styles.userGroupFocus}>
        {userGroups.map((userGroup, i) => (
          i === index && (
            <div key={i} className={styles.userGroupContent}>
              <div className={styles.userGroupFocusHeader}>
                <input className={styles.userGroupName} defaultValue={userGroup.name} onChange={(e) => dummy.name = e.target.value} />
                <input className={styles.userGroupDescription} defaultValue={userGroup.description} onChange={(e) => dummy.description = e.target.value} />
              </div>
              <br />
              <br />
              {userGroup.restrictions.actions.map((action, index) => (
                <div key={index} className={styles.action}>
                  <input className={styles.restrictionAction} defaultValue={action} onChange={(e) => dummy.restrictions.actions[index] = e.target.value} />
                  {userGroup.restrictions.actions.length - 1 === index && (
                    <div className={styles.btns}>
                      {userGroup.restrictions.actions.length > 1 && (
                        <button className={styles.btn} onClick={() => {
                          dummy.restrictions.actions.splice(index, 1);
                          updateUserGroup(dummy);
                        }}>X</button>
                      )}
                      <button className={styles.btn} onClick={() => {
                        dummy.restrictions.actions.push("");
                        updateUserGroup(dummy);
                      }}>+</button>
                    </div>
                  )}
                </div>
              ))}
              {userGroup.restrictions.resources.map((resource, index) => (
                <div key={index} className={styles.resource}>
                  <input className={styles.restrictionResource} defaultValue={resource} onChange={(e) => dummy.restrictions.resources[index] = e.target.value} />
                  {userGroup.restrictions.resources.length - 1 === index && (
                    <div className={styles.btns}>
                      {userGroup.restrictions.resources.length > 1 && (
                        <button className={styles.btn} onClick={() => {
                          dummy.restrictions.resources.splice(index, 1);
                          updateUserGroup(dummy);
                        }}>X</button>
                      )}
                      <button className={styles.btn} onClick={() => {
                        dummy.restrictions.resources.push("");
                        updateUserGroup(dummy);
                      }}>+</button>
                    </div>
                  )}
                </div>
              ))}
              <br />
              <button
                className={styles.userGroupButton}
                onClick={() => {
                  updateUserGroup(dummy);
                  setActiveUG("");
                }}
              >Update</button>
            </div>
          )))}
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <p className={styles.title}>User Groups</p>
      {activeUG === "" && !createUG && showUserGroups()}
      {activeUG !== "" && !createUG && showUserGroup(userGroups.findIndex((ug: UserGroupProps) => ug.id === activeUG))}
      {createUG && createUserGroup()}
      {!createUG && activeUG === "" && <button className={styles.addBtn} onClick={() => setCreateUG(true)}>Create Security Group</button>}
    </div>
  )
}
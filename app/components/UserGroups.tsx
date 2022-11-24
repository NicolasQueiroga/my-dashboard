import styles from '../styles/components/UserGroups.module.css'
import { useState, useEffect } from "react";


export default function UserGroups({ json, setJson }: ({ json: JsonProps, setJson: Function })) {
  const [userGroups, setUserGroups] = useState<Array<UserGroupProps>>(json.user_groups);
  useEffect(() => {
    setUserGroups(json.user_groups);
  }, [json.user_groups]);

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
  const [newUG, setNewUG] = useState<UserGroupProps>({ ...dummy });

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
      <div className={styles.create}>
        <input type="text" placeholder="Name" defaultValue={newUG.name} onChange={(e) => (dummy.name = e.target.value)} />
        <input type="text" placeholder="Description" defaultValue={newUG.description} onChange={(e) => (dummy.description = e.target.value)} />
        <input type="text" placeholder="Restrictions Name" defaultValue={newUG.restrictions.name} onChange={(e) => (dummy.restrictions.name = e.target.value)} />
        <input type="text" placeholder="Restrictions Description" defaultValue={newUG.restrictions.description} onChange={(e) => (dummy.restrictions.description = e.target.value)} />
        {newUG.restrictions.actions.map((action, index) => (
          <div key={index} className={styles.restriction}>
            <input type="text" placeholder="Action" defaultValue={action} onChange={(e) => (dummy.restrictions.actions[index] = e.target.value)} />
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
          <div key={index} className={styles.restriction}>
            <input type="text" placeholder="Resource" defaultValue={resource} onChange={(e) => (dummy.restrictions.resources[index] = e.target.value)} />
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
        <button className={styles.btn} onClick={() => {
          updateUserGroup(dummy);
          setCreateUG(false);
        }}>Create</button>
        <button className={styles.btn} onClick={() => {
          setCreateUG(false);
        }}>Cancel</button>
      </div>
    )
  }

  function updateUserGroup(data: UserGroupProps) {
    let newJson = { ...json };
    console.log("errrrrou", newJson);
    newJson.user_groups.map((ug) => {
      if (ug.id === data.id && data.id !== "") {
        ug.name = data.name;
        ug.description = data.description;
        ug.restrictions.name = data.restrictions.name;
        ug.restrictions.description = data.restrictions.description;
        ug.restrictions.actions = data.restrictions.actions;
        ug.restrictions.resources = data.restrictions.resources;
      } else if (data.id === "") {
        console.log("new", data);
        let currentLastId = json.user_groups[json.user_groups.length - 1].id;
        let newId = (currentLastId + 1).toString();
        data.id = newId;
        newJson.user_groups.push(data);
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
    });
    if (json.user_groups.length === 0) {
      data.id = "1";
      newJson.user_groups.push(data);
    }
    setJson(newJson);
  }

  function showUserGroups() {
    return (
      <div className={styles.userGroups}>
        {userGroups.map((userGroup) => (
          <div className={styles.userGroup} key={userGroup.id}>
            <p className={styles.userGroupName} onClick={() => setActiveUG(userGroup.id)}>{userGroup.name}</p>
            <p className={styles.userGroupDescription}>{userGroup.description}</p>
            <div className={styles.userGroupButtons}>
              <button
                className={styles.userGroupButton}
                onClick={() => {
                  deleteUserGroup(userGroup.id);
                }}
              >Delete</button>
            </div>
          </div>
        ))}
      </div>
    )
  }

  function showUserGroup(index: number) {
    dummy = { ...userGroups[index] };
    return (
      <div className={styles.userGroup}>
        {userGroups.map((userGroup, index) => (
          userGroup.id === activeUG && (
            <div key={index} className={styles.userGroup}>
              <input className={styles.userGroupName} defaultValue={userGroup.name} onChange={(e) => dummy.name = e.target.value} />
              <input className={styles.userGroupDescription} defaultValue={userGroup.description} onChange={(e) => dummy.description = e.target.value} />
              <div className={styles.restrictionsContainer}>
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
              </div>
              <div className={styles.userGroupButtons}>
                <button
                  className={styles.userGroupButton}
                  onClick={() => {
                    updateUserGroup(dummy);
                    setActiveUG("");
                  }}
                >Save</button>
                <button
                  className={styles.userGroupButton}
                  onClick={() => {
                    setActiveUG("");
                  }}
                >Cancel</button>
              </div>
            </div>
          )))}
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <p className={styles.title}>User Groups</p>
      {activeUG === "" && !createUG && showUserGroups()}
      {activeUG !== "" && !createUG && showUserGroup(userGroups.findIndex((ug) => ug.id === activeUG))}
      {createUG && createUserGroup()}
      {!createUG && activeUG === "" && <button className={styles.addBtn} onClick={() => setCreateUG(true)}>Create Security Group</button>}
    </div>
  )
}
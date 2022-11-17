import styles from '../../styles/Instances.module.css'
import { useForm } from "react-hook-form";
import { useState, useEffect, use } from "react";

/*
"instances": [
        {
          "name": "instance_1",
          "ami": "ami-0ee23bfc74a881de5",
          "instance_type": "t2.micro",
          "region": "us-east-1a",
          "security_groups_ids": [
            "1",
            "2"
          ]
        },
        {
          "name": "instance_2",
          "ami": "ami-0ee23bfc74a881de5",
          "instance_type": "t2.micro",
          "region": "us-east-1a",
          "security_groups_ids": [
            "2"
          ]
        }
      ]
*/

const amiList = [
  "ami-08c40ec9ead489470",
  "ami-0149b2da6ceec4bb0",
  "ami-0ee23bfc74a881de5",
];
const distroDict = {
  "ami-08c40ec9ead489470": "Ubuntu 22.04",
  "ami-0149b2da6ceec4bb0": "Ubuntu 20.04",
  "ami-0ee23bfc74a881de5": "Ubuntu 18.04",
}


const instanceTypeList = [
  "t2.micro",
  "t2.small",
  "t2.medium",
];


export default function Instances({ json, setJson, page, setPage, availabilityZones }: ({ json: JsonProps, setJson: Function, page: number, setPage: Function, availabilityZones: string[] })) {
  const [instances, setInstances] = useState(json.instances);
  const [createI, setCreateI] = useState(false);
  const [activeInstance, setActiveInstance] = useState("");


  let dummy: InstanceProps = {
    name: "",
    ami: "",
    instance_type: "",
    region: "",
    security_groups_ids: []
  }


  useEffect(() => {
    setInstances(json.instances);
  }, [json.instances]);

  function deleteInstance(name: string) {
    const newJson = { ...json };
    newJson.instances = newJson.instances.filter((instance) => instance.name != name);
    setJson(newJson);
  }

  function addInstance() {
    let newJson = { ...json };
    newJson.instances.push(dummy);
    setJson(newJson);
  }

  function updateInstance() {
    let newJson = { ...json };
    newJson.instances = newJson.instances.filter((instance) => instance.name != activeInstance);
    newJson.instances.push(dummy);
    setJson(newJson);
    setActiveInstance("");
  }

  function showInstances() {
    return (
      <div className={styles.instances}>
        {instances.map((instance, index) => {
          return (
            <div key={index} className={styles.instance}>
              <p className={styles.instanceName} onClick={() => { setActiveInstance(instance.name) }}>{instance.name}</p>
              <p className={styles.instanceDescription}>{(distroDict as any)[instance.ami]}</p>
              <p className={styles.instanceType}>{instance.instance_type}</p>
              <p className={styles.instanceRegion}>{instance.region}</p>
              <div className={styles.instanceSecurityGroups}>
                {instance.security_groups_ids.map((sg, k) => {
                  let sgName = "";
                  json.security_groups.forEach((secGroup) => {
                    if (secGroup.id == sg)
                      sgName = secGroup.name;
                  });
                  return (
                    <div key={k} className={styles.instanceSecurityGroup}>
                      <p>{sgName}</p>
                    </div>
                  )
                })}
              </div>
              <div className={styles.instanceButtons}>
                <button onClick={() => {
                  deleteInstance(instance.name);
                }}>Delete</button>
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  function showInstance(index: number) {
    dummy = { ...instances[index] };
    return (
      <div className={styles.instance}>
        <input type="text" placeholder="Name" defaultValue={dummy.name} onChange={(e) => { dummy.name = e.target.value }} />
        <select value={dummy.ami} onChange={(e) => { dummy.ami = e.target.value }}>
          {amiList.map((ami, index) => {
            return (
              <option key={index} defaultValue={ami}>{(distroDict as any)[ami]}</option>
            )
          })}
        </select>
        <select value={dummy.instance_type} onChange={(e) => { dummy.instance_type = e.target.value }}>
          {instanceTypeList.map((instanceType, index) => {
            return (
              <option key={index} defaultValue={instanceType}>{instanceType}</option>
            )
          })}
        </select>
        <select value={dummy.region} onChange={(e) => { dummy.region = e.target.value }}>
          {availabilityZones.map((az, index) => {
            return (
              <option key={index} defaultValue={az}>{az}</option>
            )
          })}
        </select>
        <div className={styles.instanceSecurityGroups}>
          {json.security_groups.map((sg, k) => {
            return (
              <div key={k} className={styles.instanceSecurityGroup}>
                <input type="checkbox" defaultChecked={dummy.security_groups_ids.includes(sg.id)} onChange={(e) => {
                  if (e.target.checked) {
                    dummy.security_groups_ids.push(sg.id);
                  } else {
                    dummy.security_groups_ids = dummy.security_groups_ids.filter((id) => id != sg.id);
                  }
                }} />
                <label>{sg.name}</label>
              </div>
            )
          })}
        </div>
        <div className={styles.instanceButtons}>
          <button onClick={() => {
            updateInstance();
          }}>Update</button>
        </div>
      </div>

    )
  }

  function createInstance() {
    return (
      <div className={styles.createInstance}>
        <h2>Create Instance</h2>
        <input type="text" name="name" placeholder="name" onChange={(e) => {
          dummy.name = e.target.value
        }} />
        <select name="ami" onChange={(e) => {
          dummy.ami = e.target.value
        }}>
          <option value="">Select AMI</option>
          {amiList.map((ami, index) => {
            let distro = (distroDict as any)[ami];
            console.log(ami);
            return (
              <option key={index} value={ami}>{distro}</option>
            )
          })}
        </select>
        <select name="instance_type" onChange={(e) => {
          dummy.instance_type = e.target.value
        }}>
          <option value="">Select Instance Type</option>
          {instanceTypeList.map((instanceType, index) => {
            return (
              <option key={index} value={instanceType}>{instanceType}</option>
            )
          })}
        </select>
        <select name="region" onChange={(e) => {
          dummy.region = e.target.value
        }}>
          <option value="">Select Region</option>
          {availabilityZones.map((region, index) => {
            return (
              <option key={index} value={region}>{region}</option>
            )
          })}
        </select>
        <div className={styles.sgCheckbox}>
          {json.security_groups.map((sg, index) => {
            return (
              <div className={styles.sgItems} key={index}>
                <input type="checkbox" name="sg" value={sg.id} onChange={(e) => {
                  if (e.target.checked) {
                    dummy.security_groups_ids.push(e.target.value);
                  } else {
                    dummy.security_groups_ids = dummy.security_groups_ids.filter((sg) => {
                      return sg != e.target.value;
                    })
                  }
                }} />
                <label>{sg.name}</label>
              </div>
            )
          })}
        </div>



        <div className={styles.buttons}>
          <button onClick={() => {
            addInstance();
            setCreateI(false);
          }}>Create</button>
          <button onClick={() => {
            setCreateI(false);
          }}>Cancel</button>
        </div>
      </div>
    )
  }



  return (
    <div className={styles.container}>
      <p className={styles.title}>Instances</p>
      {activeInstance === "" && !createI && showInstances()}
      {activeInstance !== "" && showInstance(instances.findIndex((instance) => { return instance.name == activeInstance }))}
      {createI && activeInstance === "" && createInstance()}
      {!createI && activeInstance === "" && (
        <div className={styles.buttons}>
          <button onClick={() => {
            setCreateI(true);
          }}>Create Instance</button>
        </div>
      )}
      <div className={styles.pageBtns}>
        <button onClick={() => setPage(page - 1)} >Previous</button>
        <p className={styles.page}>{page} / 4</p>
        <button onClick={() => setPage(page + 1)} >Next</button>
      </div>
    </div>
  )
}
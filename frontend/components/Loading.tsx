import styles from '../styles/components/Loading.module.css';


export default function Loading() {
    return (
        <div className={styles.loading}>
            <h1>Generating...</h1>
        </div>
    )
}

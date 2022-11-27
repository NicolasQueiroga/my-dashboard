import styles from '../styles/components/Loading.module.css';


export default function Loading({ page, setPage }: ({ page: number, setPage: Function })) {
    return (
        <div className={styles.loading}>
            <h1>Generating...</h1>
        </div>
    )
}

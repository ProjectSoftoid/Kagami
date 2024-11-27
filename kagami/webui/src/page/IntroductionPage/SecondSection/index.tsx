import {type FC} from 'react';
import logo from '../../../picture/logo.jpg';
import name from '../../../picture/word.jpg';
import styles from './styles.module.scss';

const Secondsection: FC = () => (
  <div className={styles.parentContainer}>
    <div className={styles.logo}>
      <img src={logo} alt='logo'/>
    </div>
    <div className={styles.name}>
      <img src={name} alt='name' />
    </div>
    <div className={styles.searchContainer}>
      <input
        type='text'
        className={styles.searchInput}
        // Value={query}
        // onChange={(e) => setQuery(e.target.value)}
        placeholder='Searhing for Mirror....'
      />
      <button className={styles.searchButton} >
        Search
      </button>
    </div>

  </div>
);
export default Secondsection;

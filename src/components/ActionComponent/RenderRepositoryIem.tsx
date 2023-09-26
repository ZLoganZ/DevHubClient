import GithubColors from 'github-colors';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCodeFork, faStar } from '@fortawesome/free-solid-svg-icons';

import { RepositoryType } from '@/types';
import { getTheme } from '@/util/theme';
import { commonColor } from '@/util/cssVariable';

const RenderRepositoryIem = (item: RepositoryType, index: number) => {
  const { themeColorSet } = getTheme();

  const colorLanguage = GithubColors.get(item.languages)?.color;

  return (
    <a
      key={index}
      className="renderRepositoryIem mb-5"
      style={{
        borderBottom: `1px solid ${themeColorSet.colorBg4}`,
        width: '48%'
      }}
      href={item.url}
      target="_blank">
      <div className="top">
        <span>
          <img
            className="iconRepos inline"
            style={{ color: 'red' }}
            src="/images/Common/repos.svg"
          />
        </span>
        <span
          className="name ml-2"
          style={{
            color: commonColor.colorBlue3,
            fontWeight: 600,
            fontSize: '1.1rem'
          }}>
          {item.name}
        </span>
        <span
          className="rounded-lg ml-3"
          style={{
            color: themeColorSet.colorText3,
            border: `1px solid ${themeColorSet.colorBg4}`,
            fontSize: '0.8rem',
            padding: '0.1rem 0.5rem'
          }}>
          {item.private ? 'Private' : 'Public'}
        </span>
      </div>
      <div
        className="bottom mt-3 flex items-center"
        style={{ color: themeColorSet.colorText2 }}>
        <div className="language mr-4 flex items-center">
          <span className="mr-2 pb-2 text-4xl" style={{ color: colorLanguage }}>
            •
          </span>
          <span>{item.languages}</span>
        </div>
        <span className="star mr-3" style={{ color: themeColorSet.colorText3 }}>
          <FontAwesomeIcon size="xs" icon={faStar} />
          <span className="ml-1">{item.stargazersCount}</span>
        </span>
        <span className="fork" style={{ color: themeColorSet.colorText3 }}>
          <FontAwesomeIcon size="xs" icon={faCodeFork} />
          <span className="ml-1">{item.forksCount}</span>
        </span>
      </div>
    </a>
  );
};

export default RenderRepositoryIem;

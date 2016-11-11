import main from '../less/main.less';
export default function getLessVar(name) {
  return main["@" + name];
}

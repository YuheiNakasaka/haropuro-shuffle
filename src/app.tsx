import { useEffect, useState } from "preact/hooks";
import { memberChars, members } from "../common/members";

const defaultMessage = "O O O O";

const randIndex = (): number =>
  parseInt((Math.random() * (memberChars.length - 1)).toFixed(0));

const genRandMemberChars = (count: number): String[] => {
  return Array.from(Array(count).keys()).map(() => memberChars[randIndex()]);
};

const matchedRandMemberName = (randChars: String[]) => {
  let ret: String = "";
  const chars = randChars.sort();
  for (let i = 0; i < members.length; i++) {
    const member = members[i];
    if (JSON.stringify(member?.split("").sort()) === JSON.stringify(chars)) {
      ret = member!;
      break;
    }
  }
  return ret;
};

const matchMemberName = (name: String) => {
  return members.includes(name);
};

let count = 0;
let timer: number;

function Main() {
  const [charCount, setCharCount] = useState(4);
  const [outputName, setOutputName] = useState(defaultMessage);
  const [shuffling, setShuffling] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [latestResult, setLatestResult] = useState<string[]>([]);

  useEffect(() => {
    setFetching(true);
    fetchMembers();
  }, []);

  const onChangeSelectForm = (target: EventTarget) => {
    if (target instanceof HTMLSelectElement) {
      setCharCount(parseInt(target.value));
    }
  };

  const fetchMembers = () => {
    return fetch("/api/shuffle_data")
      .then((res) => res.json<ShuffleDataResponse>())
      .then((data: ShuffleDataResponse) => {
        setLatestResult(data.memberNames);
      })
      .finally(() => {
        setFetching(false);
      });
  };

  const onClickInShuffle = () => {
    if (shuffling) return;
    count = 0;
    setShuffling(true);
    timer = setInterval(() => {
      const randMemberChars = genRandMemberChars(charCount);
      const matchedName = matchedRandMemberName(randMemberChars);
      if (1000000 > count) {
        if (matchedName !== "") {
          setOutputName(`${matchedName}`);
          setShuffling(false);
        } else {
          setOutputName(`${randMemberChars.join("")}`);
        }
      } else {
        setShuffling(false);
      }
      count++;
    }, 80);
  };

  const onClickStopTimer = () => {
    // TODO: POSTのbodyがworkers側で受け取れないのでparamsで送ってる
    count = 10001;
    clearInterval(timer);
    window
      .fetch(`/api/shuffle_data?output=${outputName}`, {
        method: "POST",
      })
      .finally(async () => {
        setShuffling(false);
        setFetching(true);
        await fetchMembers();
      });
  };

  return (
    <>
      <div id="container">
        <div id="wrap">
          <div>
            <h1>- ハロメン名前シャッフル -</h1>
          </div>
          <div>
            <p class="output">{outputName}</p>
          </div>
          <div>
            <select
              onChange={({ target }) =>
                onChangeSelectForm(target as EventTarget)
              }
              disabled={shuffling}
            >
              <option value="3">3</option>
              <option value="4" selected>
                4
              </option>
              <option value="5">5</option>
              <option value="6">6</option>
            </select>
            <div class="buttons">
              {shuffling ? (
                <button onClick={(_: Event) => onClickStopTimer()}>STOP</button>
              ) : (
                <button
                  className={fetching ? "disabled" : ""}
                  onClick={(_: Event) => onClickInShuffle()}
                  disabled={shuffling || fetching}
                >
                  START
                </button>
              )}
            </div>
          </div>
          <div class="member-lists">
            <h3>みんなの結果</h3>
            <div class="member-list">
              {latestResult.map((name) => {
                if (matchMemberName(name)) {
                  return <div class="name bold">{name}</div>;
                } else {
                  return <div class="name">{name}</div>;
                }
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export function App() {
  return <Main />;
}

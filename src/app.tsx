import { useState } from "preact/hooks"
import { ChakraProvider, Flex, Box, FormControl, Select, Button, Text, Spacer, Link } from "@chakra-ui/react"

const defaultMessage = "O O O O"

const members: String[] = [
  "譜久村聖",
  "生田衣梨奈",
  "石田亜佑美",
  "佐藤優樹",
  "小田さくら",
  "野中美希",
  "牧野真莉愛",
  "羽賀朱音",
  "加賀楓",
  "横山玲奈",
  "森戸知沙希",
  "北川莉央",
  "岡村ほまれ",
  "山﨑愛生",
  "竹内朱莉",
  "川村文乃",
  "佐々木莉佳子",
  "上國料萌衣",
  "伊勢鈴蘭",
  "橋迫鈴",
  "川名凜",
  "為永幸音",
  "松本わかな",
  "植村あかり",
  "稲場愛香",
  "井上玲音",
  "段原瑠々",
  "工藤由愛",
  "松永里愛",
  "有澤一華",
  "入江里咲",
  "江端妃咲",
  "山岸理子",
  "新沼希空",
  "谷本安美",
  "岸本ゆめの",
  "浅倉樹々",
  "小野瑞歩",
  "小野田紗栞",
  "秋山眞緒",
  "河西結心",
  "八木栞",
  "福田真琳",
  "豫風瑠乃",
  "一岡伶奈",
  "島倉りか",
  "西田汐里",
  "江口紗耶",
  "高瀬くるみ",
  "前田こころ",
  "山﨑夢羽",
  "岡村美波",
  "清野桃々姫",
  "平井美葉",
  "小林萌花",
  "里吉うたの",
]

const memberChars = members.map((member) => member.split("")).flat()

const randIndex = (): number => parseInt((Math.random() * (memberChars.length - 1)).toFixed(0))

const genRandMemberChars = (count: number): String[] => {
  return Array.from(Array(count).keys()).map(() => memberChars[randIndex()])
}

const matchMemberName = (randChars: String[]) => {
  let ret: String = ""
  const chars = randChars.sort()
  for (let i = 0; i < members.length; i++) {
    const member = members[i]
    if (JSON.stringify(member?.split("").sort()) === JSON.stringify(chars)) {
      ret = member!
      break
    }
  }
  return ret
}

let count = 0
let timer: number

function Main() {
  const [charCount, setCharCount] = useState(4)
  const [outputName, setOutputName] = useState(defaultMessage)
  const [shuffling, setShuffling] = useState(false)

  const onChangeSelectForm = (e: ChangeEvent<HTMLSelectElement>) => {
    setCharCount(parseInt(e.target.value))
  }

  const onClickInfShuffle = () => {
    if (shuffling) return
    count = 0
    setShuffling(true)
    timer = setInterval(() => {
      const randMemberChars = genRandMemberChars(charCount)
      const matchedName = matchMemberName(randMemberChars)
      if (1000000 > count) {
        if (matchedName !== "") {
          setOutputName(`${matchedName}`)
          setShuffling(false)
        } else {
          setOutputName(`${randMemberChars.join("")}`)
        }
      } else {
        setShuffling(false)
      }
      count++
    }, 80)
  }

  const onClickStopTimer = () => {
    count = 10001
    clearInterval(timer)
    setShuffling(false)
  }

  return (
    <>
      <Flex alignItems="center" justifyContent="center" w="100vw" minH="100vh">
        <Box textAlign="center">
          <Box>
            <Text
              fontSize={{
                base: "1.5rem",
                sm: "1.5rem",
                md: "3.5rem",
                lg: "5rem",
              }}
              fontWeight="bold"
            >
              - ハロメン名前シャッフル -
            </Text>
          </Box>
          <Box>
            <Text
              fontSize={{
                base: "3rem",
                sm: "3rem",
                md: "6rem",
                lg: "10rem",
              }}
            >
              {outputName}
            </Text>
          </Box>
          <FormControl id="country">
            <Select
              placeholder="文字数"
              onChange={(e: ChangeEvent<HTMLSelectElement>) => onChangeSelectForm(e)}
              isDisabled={shuffling}
            >
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
            </Select>
            <Spacer my={5} />
            {shuffling ? (
              <Button onClick={(_: Event) => onClickStopTimer()}>STOP</Button>
            ) : (
              <Button
                onClick={(_: Event) => onClickInfShuffle()}
                isDisabled={shuffling}
                isLoading={shuffling}
              >
                START
              </Button>
            )}
          </FormControl>
        </Box>
      </Flex>
    </>
  )
}

export function App() {
  return (
    <ChakraProvider>
      <Main />
    </ChakraProvider>
  )
}

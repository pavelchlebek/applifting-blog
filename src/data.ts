import { Article } from './components/Article/Article';

export const articles: PropsOf<typeof Article>[] = [
  {
    author: "Elisabeth Strain",
    comments: 4,
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Cat_November_2010-1a.jpg/1200px-Cat_November_2010-1a.jpg",
    perex: `A cat's whiskers — or vibrissae — are a well-honed sensory tool that helps a cat see in the dark and steer clear of hungry predators. Whiskers are highly sensitive tactile hairs that grow in patterns on a cat's muzzle, above its eyes and elsewhere on its body, like the ears, jaw and forelegs`,
    published: new Date(),
    title: "Why Do Cats Have Whiskers?",
  },
]

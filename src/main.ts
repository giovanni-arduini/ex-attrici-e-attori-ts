type Person = {
  readonly id: number;
  readonly name: string;
  birth_year: number;
  death_year?: number;
  biography: string;
  image: string;
};

type Nationality =
  | "American"
  | "British"
  | "Australian"
  | "Israeli-American"
  | "South African"
  | "French"
  | "Indian"
  | "Israeli"
  | "Spanish"
  | "South Korean"
  | "Chinese";

type Actress = Person & {
  most_famous_movies: [string, string, string];
  awards: string;
  nationality: Nationality;
};

function isActress(data: unknown): data is Actress {
  return (
    typeof data === "object" &&
    data !== null &&
    "id" in data &&
    typeof data.id === "number" &&
    "name" in data &&
    typeof data.name === "string" &&
    "birth_year" in data &&
    typeof data.birth_year === "number" &&
    // "death_year" in data &&
    // typeof data.death_year === "number" &&
    "biography" in data &&
    typeof data.biography === "string" &&
    "image" in data &&
    typeof data.image === "string" &&
    "most_famous_movies" in data &&
    data.most_famous_movies instanceof Array &&
    data.most_famous_movies.length === 3 &&
    data.most_famous_movies.every((movie) => typeof movie === "string") &&
    "awards" in data &&
    typeof data.awards === "string" &&
    "nationality" in data &&
    typeof data.nationality === "string"
  );
}

async function getActress(id: number): Promise<Actress | null> {
  try {
    const response = await fetch(
      `https://boolean-spec-frontend.vercel.app/freetestapi/actresses/${id}`
    );
    const data: unknown = await response.json();
    if (!isActress(data)) {
      throw new Error("Formato dei dati non valido");
    }
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function getAllActresses(): Promise<Actress[]> {
  try {
    const response = await fetch(
      `https://boolean-spec-frontend.vercel.app/freetestapi/actresses`
    );
    if (!response.ok) {
      throw new Error(`Errore HTTP ${response.status}: ${response.statusText}`);
    }
    const data: unknown = await response.json();
    if (!(data instanceof Array)) {
      throw new Error("Il formato di data non è un array");
    }
    const actressesArray: Actress[] = data.filter((a) => isActress(a));
    return actressesArray;
  } catch (error) {
    console.error("Errore nel recupero dei dati");
    return [];
  }
}

async function getAcresses(ids: number[]): Promise<(Actress | null)[]> {
  try {
    const response = await Promise.all(ids.map((id) => getActress(id)));
    return response;
  } catch (error) {
    console.error("Errore nel recupero dei dati");
    return [];
  }
}

function createActress(data: Omit<Actress, "id">): Actress {
  return {
    ...data,
    id: Math.floor(Math.random() * 1000),
  };
}

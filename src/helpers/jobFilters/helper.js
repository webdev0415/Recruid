import { API_ROOT_PATH } from "constants/api";

// body =>  @parameters:
// min_salary = int, max_salary = int, localizations_ids = arr, job_type = str, keyword = str, page = int, date

export async function candidateSearchRequest(
  session,
  companyId,
  jobId,
  keyword,
  callback
) {
  const endpoint = `${API_ROOT_PATH}/v1/companies/job_posts/${jobId}/search_candidates?company_id=${companyId}&search_term=${keyword}&talent_network=true`;
  const parameters = { method: `GET`, headers: session };
  try {
    const request = await fetch(endpoint, parameters);
    const response = await request.json();
    return callback(response.search_results);
  } catch (err) {
    console.error(`Error searching for a candidate`);
  }
}

export function extractNames(list, type) {
  let values = [];

  for (var listItem in list) {
    let newElementName = undefined;

    if (list[listItem].name === undefined && type === "Skill") {
      newElementName = list[listItem].skillAttributes.name;
    } else if (list[listItem].name === undefined && type === "Location") {
      newElementName = list[listItem].locationAttributes.name;
    } else if (list[listItem].name === undefined && type === "Category") {
      newElementName = list[listItem].CategoryAttributes.name;
    }

    values.push(list[listItem].name || newElementName);
  }
  return values;
}

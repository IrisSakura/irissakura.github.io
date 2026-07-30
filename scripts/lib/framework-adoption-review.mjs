const ADOPTION_REVIEW_HASH_PATTERN = /^sha256:[0-9a-f]{64}$/;
const SUPPORTED_ADOPTION_REVIEW_CONTRACT = 'supported-stable-v1';

export function assertFrameworkAdoptionReviewed(framework, adoption) {
  const frameworkContract = framework?.adoptionReviewContract ?? '';
  if (frameworkContract !== SUPPORTED_ADOPTION_REVIEW_CONTRACT) {
    throw new Error(
      `framework adoption review required: framework contract ${frameworkContract || '<missing>'} `
      + `is not supported; website accepts ${SUPPORTED_ADOPTION_REVIEW_CONTRACT}`
    );
  }

  const reviewedContract = adoption?.adoptionReviewContract ?? '';
  if (reviewedContract !== frameworkContract) {
    throw new Error(
      `framework adoption review required: reviewed contract ${reviewedContract || '<missing>'} `
      + `does not match framework contract ${frameworkContract}; `
      + 'update the website validator and data/framework-adoption.json before syncing'
    );
  }

  const frameworkHash = framework?.adoptionReviewHash ?? '';
  if (!ADOPTION_REVIEW_HASH_PATTERN.test(frameworkHash)) {
    throw new Error('framework snapshot is missing a valid adoptionReviewHash');
  }

  const reviewedHash = adoption?.adoptionReviewHash ?? '';
  if (!ADOPTION_REVIEW_HASH_PATTERN.test(reviewedHash)) {
    throw new Error(
      'framework adoption review required: data/framework-adoption.json is missing a valid adoptionReviewHash'
    );
  }

  if (reviewedHash !== frameworkHash) {
    throw new Error(
      `framework adoption review required: reviewed hash ${reviewedHash} does not match framework hash ${frameworkHash}; `
      + 'review Supported package identities and stable route closures before updating data/framework-adoption.json'
    );
  }
}

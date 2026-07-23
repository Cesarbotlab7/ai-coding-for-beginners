import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { CURRICULUM } from '../../src/lib/curriculum';

const chaptersDirectory = resolve(process.cwd(), 'content/chapters');

function readScalar(frontmatter: string, key: string) {
  const match = frontmatter.match(new RegExp(`^${key}:\\s*["']?([^"'\\n]+)["']?\\s*$`, 'm'));
  return match?.[1].trim();
}

function readChapterFiles() {
  return readdirSync(chaptersDirectory)
    .filter((fileName) => fileName.endsWith('.mdx'))
    .map((fileName) => {
      const source = readFileSync(resolve(chaptersDirectory, fileName), 'utf8');
      const frontmatter = source.match(/^---\n([\s\S]+?)\n---/)?.[1] ?? '';
      return {
        fileName,
        source,
        slug: readScalar(frontmatter, 'slug'),
        order: Number(readScalar(frontmatter, 'order')),
        stage: Number(readScalar(frontmatter, 'stage')),
        coreComponent: readScalar(frontmatter, 'core_component'),
        verified: readScalar(frontmatter, 'verified'),
        verifiedVersion: readScalar(frontmatter, 'verified_version'),
        hasSources: /^sources:\s*$/m.test(frontmatter),
        hasTakeaways: /^takeaways:\s*$/m.test(frontmatter),
      };
    })
    .sort((a, b) => a.order - b.order);
}

describe('章节内容结构', () => {
  const chapters = readChapterFiles();

  it('只包含课程 SSOT 定义的 11 个章节', () => {
    expect(chapters).toHaveLength(CURRICULUM.length);
    expect(chapters.map((chapter) => chapter.slug)).toEqual(
      CURRICULUM.map((lesson) => lesson.slug),
    );
  });

  it('顺序和阶段与课程 SSOT 一致', () => {
    expect(
      chapters.map(({ slug, order, stage }) => ({ slug, order, stage })),
    ).toEqual(CURRICULUM);
  });

  it('每章都有一个核心交互、核验版本、来源和收尾要点', () => {
    for (const chapter of chapters) {
      expect(chapter.coreComponent, chapter.fileName).toBeTruthy();
      expect(chapter.verified, chapter.fileName).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(chapter.verifiedVersion, chapter.fileName).toBeTruthy();
      expect(chapter.hasSources, chapter.fileName).toBe(true);
      expect(chapter.hasTakeaways, chapter.fileName).toBe(true);

      const componentTag = `<${chapter.coreComponent} />`;
      expect(
        chapter.source.split(componentTag).length - 1,
        `${chapter.fileName} 应恰好包含一次 ${componentTag}`,
      ).toBe(1);
    }
  });
});

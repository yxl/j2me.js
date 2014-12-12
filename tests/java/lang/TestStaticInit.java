package java.lang;

import gnu.testlet.Testlet;
import gnu.testlet.TestHarness;

class TestClass {
    static int value = 0;
}

class TestClassB extends TestClass {
}

public class TestStaticInit implements Testlet {
    public void test(TestHarness th) {
        TestClass.value = 1;
        TestClassB newInstance = new TestClassB();
        th.check(TestClass.value, 1);
    }
}
